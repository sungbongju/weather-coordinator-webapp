import { useState, useEffect, useCallback, useRef } from 'react';
import type { GeocodingResult, CitySearchResult } from '@/types/location';

interface UseCitySearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: CitySearchResult[];
  isSearching: boolean;
  error: string | null;
  clearResults: () => void;
}

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

/** OWM Geocoding 결과를 UI용으로 변환 (한국어 이름 우선) */
function transformResults(items: GeocodingResult[]): CitySearchResult[] {
  const seen = new Set<string>();
  const results: CitySearchResult[] = [];

  for (const item of items) {
    // 좌표 기반 중복 제거 (소수점 2자리)
    const key = `${item.lat.toFixed(2)},${item.lon.toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    results.push({
      displayName: item.local_names?.ko || item.name,
      country: item.country,
      state: item.state,
      latitude: item.lat,
      longitude: item.lon,
    });
  }

  return results;
}

export function useCitySearch(): UseCitySearchReturn {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 이전 타이머 정리
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 짧은 쿼리는 검색하지 않음
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsSearching(false);
      setError(null);
      return;
    }

    setIsSearching(true);

    timerRef.current = setTimeout(async () => {
      // 이전 요청 취소
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `/api/geocode?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error(`검색 실패 (${res.status})`);
        }

        const data: GeocodingResult[] = await res.json();
        if (!controller.signal.aborted) {
          setResults(transformResults(data));
          setError(null);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        if (!controller.signal.aborted) {
          setError('도시 검색에 실패했습니다.');
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const clearResults = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setIsSearching(false);
    abortRef.current?.abort();
  }, []);

  return { query, setQuery, results, isSearching, error, clearResults };
}
