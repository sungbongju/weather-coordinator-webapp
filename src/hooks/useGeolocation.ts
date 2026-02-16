import { useState, useEffect } from 'react';
import type { GeolocationState, GeoLocation } from '@/types/weather';

export const DEFAULT_LOCATION: GeoLocation = {
  latitude: 37.5665,
  longitude: 126.978,
};

const GEOLOCATION_TIMEOUT = 10000;

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: DEFAULT_LOCATION,
        error: '이 브라우저에서 위치 서비스를 지원하지 않습니다.',
        isLoading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        setState({
          location: DEFAULT_LOCATION,
          error: error.message,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: GEOLOCATION_TIMEOUT,
        maximumAge: 600000, // 10분 캐시
      },
    );
  }, []);

  return state;
}
