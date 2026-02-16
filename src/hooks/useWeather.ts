import { useState, useEffect, useCallback } from 'react';
import type { WeatherData, GeoLocation } from '@/types/weather';

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWeather(location: GeoLocation | null): UseWeatherReturn {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);

  const refetch = useCallback(() => {
    setFetchCount((c) => c + 1);
  }, []);

  useEffect(() => {
    if (!location) return;

    let cancelled = false;

    const { latitude, longitude } = location;

    async function fetchWeather() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/weather?lat=${latitude}&lng=${longitude}`,
        );

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = (await res.json()) as WeatherData;

        if (!cancelled) {
          setWeatherData(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '날씨 데이터를 가져오는 데 실패했습니다.');
          setIsLoading(false);
        }
      }
    }

    void fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [location, fetchCount]);

  return { weatherData, isLoading, error, refetch };
}
