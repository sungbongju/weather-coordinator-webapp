import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClothingPhotoModal } from '../ClothingPhotoModal';
import type { ClothingItem } from '@/types/outfit';

// framer-motion mock
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop: string) => {
      return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        const { initial, animate, exit, transition, variants, whileHover, whileTap, ...rest } = props;
        const Tag = prop as keyof JSX.IntrinsicElements;
        return <Tag {...rest}>{children}</Tag>;
      };
    },
  }),
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// useClothingImages mock
vi.mock('@/hooks/useClothingImages', () => ({
  useClothingImages: vi.fn(),
}));

import { useClothingImages } from '@/hooks/useClothingImages';
const mockUseClothingImages = vi.mocked(useClothingImages);

const mockItem: ClothingItem = {
  id: 'outer-padding',
  name: '패딩',
  nameEn: 'Puffer Jacket',
  category: 'OUTER',
  imageUrl: '/assets/clothing/outer/puffer.webp',
  tempLevels: ['FREEZING', 'COLD'],
  tags: ['방한', '캐주얼'],
};

const mockImages = [
  { title: '패딩 코디', link: 'https://example.com/1.jpg', thumbnail: 'https://example.com/t1.jpg', width: 400, height: 600 },
  { title: '겨울 패딩', link: 'https://example.com/2.jpg', thumbnail: 'https://example.com/t2.jpg', width: 600, height: 800 },
];

describe('ClothingPhotoModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('item이 null이면 아무것도 렌더하지 않는다', () => {
    mockUseClothingImages.mockReturnValue({ images: [], isLoading: false, error: null });
    const { container } = render(<ClothingPhotoModal item={null} onClose={() => {}} />);
    expect(container.innerHTML).toBe('');
  });

  it('아이템 이름을 표시한다', () => {
    mockUseClothingImages.mockReturnValue({ images: mockImages, isLoading: false, error: null });
    render(<ClothingPhotoModal item={mockItem} onClose={() => {}} />);
    expect(screen.getByText('패딩')).toBeInTheDocument();
    expect(screen.getByText('Puffer Jacket')).toBeInTheDocument();
  });

  it('이미지를 표시한다', () => {
    mockUseClothingImages.mockReturnValue({ images: mockImages, isLoading: false, error: null });
    render(<ClothingPhotoModal item={mockItem} onClose={() => {}} />);
    const imgs = screen.getAllByRole('img');
    expect(imgs).toHaveLength(2);
    expect(imgs[0]).toHaveAttribute('src', 'https://example.com/t1.jpg');
  });

  it('로딩 중일 때 스켈레톤을 표시한다', () => {
    mockUseClothingImages.mockReturnValue({ images: [], isLoading: true, error: null });
    const { container } = render(<ClothingPhotoModal item={mockItem} onClose={() => {}} />);
    expect(container.querySelector('.skeleton-shimmer')).toBeInTheDocument();
  });

  it('에러 메시지를 표시한다', () => {
    mockUseClothingImages.mockReturnValue({ images: [], isLoading: false, error: '네트워크 오류' });
    render(<ClothingPhotoModal item={mockItem} onClose={() => {}} />);
    expect(screen.getByText('네트워크 오류')).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose를 호출한다', () => {
    mockUseClothingImages.mockReturnValue({ images: mockImages, isLoading: false, error: null });
    const onClose = vi.fn();
    render(<ClothingPhotoModal item={mockItem} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('배경 클릭 시 onClose를 호출한다', () => {
    mockUseClothingImages.mockReturnValue({ images: mockImages, isLoading: false, error: null });
    const onClose = vi.fn();
    render(<ClothingPhotoModal item={mockItem} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('이미지가 없을 때 안내 문구를 표시한다', () => {
    mockUseClothingImages.mockReturnValue({ images: [], isLoading: false, error: null });
    render(<ClothingPhotoModal item={mockItem} onClose={() => {}} />);
    expect(screen.getByText('이미지를 찾을 수 없습니다.')).toBeInTheDocument();
  });
});
