import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCitySearch } from '../useCitySearch';

const mockGeocodingResponse = [
  {
    name: 'Tokyo',
    local_names: { ko: '도쿄', en: 'Tokyo' },
    lat: 35.6762,
    lon: 139.6503,
    country: 'JP',
  },
  {
    name: 'Tokushima',
    local_names: { ko: '도쿠시마' },
    lat: 34.0658,
    lon: 134.5593,
    country: 'JP',
    state: 'Tokushima',
  },
];

describe('useCitySearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('초기 상태: 빈 쿼리, 빈 결과, 검색 중 아님', () => {
    const { result } = renderHook(() => useCitySearch());

    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.isSearching).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('2글자 미만 쿼리는 fetch하지 않는다', async () => {
    const { result } = renderHook(() => useCitySearch());

    act(() => result.current.setQuery('T'));
    await act(async () => { await vi.advanceTimersByTimeAsync(500); });

    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.results).toEqual([]);
  });

  it('2글자 이상 쿼리는 300ms 후 fetch한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockGeocodingResponse), { status: 200 }),
    );

    const { result } = renderHook(() => useCitySearch());

    act(() => result.current.setQuery('To'));

    // 200ms 후에는 아직 fetch 안 함
    await act(async () => { await vi.advanceTimersByTimeAsync(200); });
    expect(fetch).not.toHaveBeenCalled();

    // 300ms 후 fetch
    await act(async () => { await vi.advanceTimersByTimeAsync(100); });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('결과에서 한국어 이름을 우선 사용한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockGeocodingResponse), { status: 200 }),
    );

    const { result } = renderHook(() => useCitySearch());

    act(() => result.current.setQuery('Tokyo'));
    await act(async () => { await vi.advanceTimersByTimeAsync(300); });

    expect(result.current.results.length).toBeGreaterThan(0);
    expect(result.current.results[0].displayName).toBe('도쿄');
  });

  it('한국어 이름이 없으면 영문 이름을 사용한다', async () => {
    const noKoResponse = [
      { name: 'Berlin', lat: 52.52, lon: 13.405, country: 'DE' },
    ];
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(noKoResponse), { status: 200 }),
    );

    const { result } = renderHook(() => useCitySearch());

    act(() => result.current.setQuery('Berlin'));
    await act(async () => { await vi.advanceTimersByTimeAsync(300); });

    expect(result.current.results.length).toBe(1);
    expect(result.current.results[0].displayName).toBe('Berlin');
  });

  it('fetch 실패 시 에러 상태를 설정한다', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCitySearch());

    act(() => result.current.setQuery('Seoul'));
    await act(async () => { await vi.advanceTimersByTimeAsync(300); });

    expect(result.current.error).toBe('도시 검색에 실패했습니다.');
  });

  it('clearResults는 쿼리, 결과, 에러를 초기화한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockGeocodingResponse), { status: 200 }),
    );

    const { result } = renderHook(() => useCitySearch());

    act(() => result.current.setQuery('Tokyo'));
    await act(async () => { await vi.advanceTimersByTimeAsync(300); });

    expect(result.current.results.length).toBeGreaterThan(0);

    act(() => result.current.clearResults());

    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
