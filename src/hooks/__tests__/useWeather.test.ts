import { renderHook, waitFor } from '@testing-library/react';
import { useWeather } from '../useWeather';
import { useWeatherStore } from '@/store/weatherStore';
import { mockWeatherMild } from '@/__tests__/fixtures/weatherData';

describe('useWeather', () => {
  beforeEach(() => {
    useWeatherStore.getState().reset();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('위치가 설정되면 날씨 데이터를 fetch해야 한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockWeatherMild), { status: 200 }),
    );

    const location = { latitude: 37.5665, longitude: 126.978 };
    const { result } = renderHook(() => useWeather(location));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.weatherData).toEqual(mockWeatherMild);
    expect(result.current.error).toBeNull();
  });

  it('위치가 null이면 fetch하지 않아야 한다', () => {
    const { result } = renderHook(() => useWeather(null));

    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.weatherData).toBeNull();
  });

  it('fetch 실패 시 에러 상태를 설정해야 한다', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const location = { latitude: 37.5665, longitude: 126.978 };
    const { result } = renderHook(() => useWeather(location));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.weatherData).toBeNull();
  });

  it('fetch 중 isLoading이 true여야 한다', async () => {
    let resolvePromise: (value: Response) => void;
    const pendingPromise = new Promise<Response>((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(fetch).mockReturnValueOnce(pendingPromise);

    const location = { latitude: 37.5665, longitude: 126.978 };
    const { result } = renderHook(() => useWeather(location));

    expect(result.current.isLoading).toBe(true);

    resolvePromise!(new Response(JSON.stringify(mockWeatherMild), { status: 200 }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('refetch 함수가 데이터를 다시 가져와야 한다', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify(mockWeatherMild), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ...mockWeatherMild, temperature: 20 }), { status: 200 }),
      );

    const location = { latitude: 37.5665, longitude: 126.978 };
    const { result } = renderHook(() => useWeather(location));

    await waitFor(() => {
      expect(result.current.weatherData?.temperature).toBe(15);
    });

    result.current.refetch();

    await waitFor(() => {
      expect(result.current.weatherData?.temperature).toBe(20);
    });
  });
});
