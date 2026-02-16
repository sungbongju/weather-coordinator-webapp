// 위치 검색 관련 타입 정의

/** 위치 소스 */
export type LocationSource = 'gps' | 'search' | 'stored';

/** 선택된 위치 정보 */
export interface SelectedLocation {
  latitude: number;
  longitude: number;
  cityName: string;       // "서울", "Tokyo"
  country: string;        // "KR", "JP"
  state?: string;         // "California" 등
  source: LocationSource;
}

/** OpenWeatherMap Geocoding API 응답 항목 */
export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

/** 도시 검색 결과 (UI용) */
export interface CitySearchResult {
  displayName: string;    // local_names.ko || name
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
}
