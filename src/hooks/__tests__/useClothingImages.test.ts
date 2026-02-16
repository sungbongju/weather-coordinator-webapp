import { renderHook, waitFor } from '@testing-library/react';
import { useClothingImages } from '../useClothingImages';
import type { ClothingImage } from '@/types/image';

const mockImages: ClothingImage[] = [
  { title: '패딩 코디', link: 'https://example.com/1.jpg', thumbnail: 'https://example.com/t1.jpg', width: 400, height: 600 },
  { title: '겨울 패딩', link: 'https://example.com/2.jpg', thumbnail: 'https://example.com/t2.jpg', width: 600, height: 800 },
];

describe('useClothingImages', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('itemName이 null이면 fetch하지 않는다', () => {
    const { result } = renderHook(() => useClothingImages(null));

    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.images).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('itemName이 설정되면 이미지를 fetch한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ images: mockImages }), { status: 200 }),
    );

    const { result } = renderHook(() => useClothingImages('패딩'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.images).toHaveLength(2);
    expect(result.current.images[0]?.title).toBe('패딩 코디');
    expect(result.current.error).toBeNull();
  });

  it('fetch 실패 시 에러 상태를 설정한다', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useClothingImages('패딩'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.images).toEqual([]);
  });

  it('fetch 중 isLoading이 true여야 한다', () => {
    vi.mocked(fetch).mockReturnValueOnce(
      new Promise<Response>(() => {}),
    );

    const { result } = renderHook(() => useClothingImages('패딩'));

    expect(result.current.isLoading).toBe(true);
  });

  it('같은 itemName으로 재요청 시 캐시를 사용한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ images: mockImages }), { status: 200 }),
    );

    const { result, rerender } = renderHook(
      ({ name }: { name: string | null }) => useClothingImages(name),
      { initialProps: { name: '패딩' } },
    );

    await waitFor(() => {
      expect(result.current.images).toHaveLength(2);
    });

    // null로 변경 후 다시 같은 이름으로
    rerender({ name: null });
    rerender({ name: '패딩' });

    // fetch는 1번만 호출됨 (캐시)
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result.current.images).toHaveLength(2);
  });
});
