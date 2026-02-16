import { renderHook, waitFor } from '@testing-library/react';
import { useGeolocation } from '../useGeolocation';

const SEOUL_LAT = 37.5665;
const SEOUL_LNG = 126.978;

function mockGeolocation(overrides?: Partial<Geolocation>) {
  const geo: Geolocation = {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
    ...overrides,
  };
  vi.stubGlobal('navigator', { ...navigator, geolocation: geo });
  return geo;
}

describe('useGeolocation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('초기 상태에서 isLoading이 true여야 한다', () => {
    mockGeolocation({
      getCurrentPosition: vi.fn(), // 아무것도 호출하지 않음
    });

    const { result } = renderHook(() => useGeolocation());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.location).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('위치 권한 허용 시 좌표를 반환해야 한다', async () => {
    mockGeolocation({
      getCurrentPosition: vi.fn((success) => {
        success({
          coords: { latitude: 35.1796, longitude: 129.0756 },
        } as GeolocationPosition);
      }),
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toEqual({
      latitude: 35.1796,
      longitude: 129.0756,
    });
    expect(result.current.error).toBeNull();
  });

  it('위치 권한 거부 시 서울 좌표로 fallback해야 한다', async () => {
    mockGeolocation({
      getCurrentPosition: vi.fn((_success, error) => {
        error!({
          code: 1, // PERMISSION_DENIED
          message: 'User denied Geolocation',
        } as GeolocationPositionError);
      }),
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toEqual({
      latitude: SEOUL_LAT,
      longitude: SEOUL_LNG,
    });
  });

  it('위치 권한 거부 시 에러 메시지를 설정해야 한다', async () => {
    mockGeolocation({
      getCurrentPosition: vi.fn((_success, error) => {
        error!({
          code: 1,
          message: 'User denied Geolocation',
        } as GeolocationPositionError);
      }),
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
  });

  it('geolocation API 미지원 시 서울 fallback해야 한다', async () => {
    vi.stubGlobal('navigator', { geolocation: undefined });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toEqual({
      latitude: SEOUL_LAT,
      longitude: SEOUL_LNG,
    });
    expect(result.current.error).not.toBeNull();
  });

  it('타임아웃 시 서울 fallback해야 한다', async () => {
    mockGeolocation({
      getCurrentPosition: vi.fn((_success, error) => {
        error!({
          code: 3, // TIMEOUT
          message: 'Timeout expired',
        } as GeolocationPositionError);
      }),
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).toEqual({
      latitude: SEOUL_LAT,
      longitude: SEOUL_LNG,
    });
  });

  it('좌표 로드 완료 후 isLoading이 false여야 한다', async () => {
    mockGeolocation({
      getCurrentPosition: vi.fn((success) => {
        success({
          coords: { latitude: 37.0, longitude: 127.0 },
        } as GeolocationPosition);
      }),
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.location).not.toBeNull();
  });
});
