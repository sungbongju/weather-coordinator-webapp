// 날씨 관련 타입 정의

/** 앱 내부에서 사용하는 정제된 날씨 데이터 */
export interface WeatherData {
  temperature: number;              // 현재 기온 (°C)
  feelsLike: number;                // 체감 온도 (°C)
  tempMin: number;                  // 24h 최저 (°C)
  tempMax: number;                  // 24h 최고 (°C)
  humidity: number;                 // 습도 (%)
  windSpeed: number;                // 풍속 (km/h)
  precipitationProbability: number; // 강수 확률 (%)
  precipitationType: PrecipitationType;
  uvIndex: number;
  condition: WeatherConditionType;
  conditionText: string;            // 한글 설명
  iconUri: string;
  isDaytime: boolean;
  cloudCover: number;               // 구름량 (%)
}

/** 강수 타입 */
export type PrecipitationType = 'RAIN' | 'SNOW' | 'MIXED';

/** 날씨 상태 타입 */
export type WeatherConditionType =
  | 'CLEAR'
  | 'MOSTLY_CLEAR'
  | 'PARTLY_CLOUDY'
  | 'MOSTLY_CLOUDY'
  | 'CLOUDY'
  | 'LIGHT_RAIN'
  | 'RAIN'
  | 'HEAVY_RAIN'
  | 'LIGHT_SNOW'
  | 'SNOW'
  | 'HEAVY_SNOW'
  | 'THUNDERSTORM'
  | 'FOGGY'
  | 'WINDY';

/** 위치 좌표 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

/** Geolocation hook 상태 */
export interface GeolocationState {
  location: GeoLocation | null;
  error: string | null;
  isLoading: boolean;
}

/** Weather API 요청 파라미터 */
export interface WeatherRequestParams {
  lat: number;
  lng: number;
}

// --- OpenWeatherMap API 원본 타입 ---

export interface OWMWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OWMMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface OWMWind {
  speed: number;   // m/s
  deg: number;
  gust?: number;
}

export interface OWMClouds {
  all: number;     // 구름량 %
}

export interface OWMSys {
  country: string;
  sunrise: number;
  sunset: number;
}

/** OpenWeatherMap 2.5 Current Weather 응답 */
export interface OWMWeatherResponse {
  weather: OWMWeatherCondition[];
  main: OWMMain;
  wind: OWMWind;
  clouds: OWMClouds;
  sys: OWMSys;
  dt: number;         // 데이터 시간 (unix)
  timezone: number;    // UTC offset (seconds)
  name: string;        // 도시 이름
}
