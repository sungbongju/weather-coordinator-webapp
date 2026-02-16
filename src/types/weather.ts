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

// --- Google Weather API 원본 타입 ---

export interface GoogleTemperature {
  degrees: number;
  unit: 'CELSIUS' | 'FAHRENHEIT';
}

export interface GoogleWind {
  direction: { degrees: number; cardinal: string };
  speed: { value: number; unit: string };
  gust: { value: number; unit: string };
}

export interface GooglePrecipitation {
  probability: { percent: number; type: string };
  qpf: { quantity: number; unit: string };
}

export interface GoogleWeatherCondition {
  iconBaseUri: string;
  description: { text: string; languageCode: string };
  type: string;
}

export interface GoogleCurrentConditionsHistory {
  temperatureChange: GoogleTemperature;
  maxTemperature: GoogleTemperature;
  minTemperature: GoogleTemperature;
}

/** Google Weather API currentConditions 응답 */
export interface GoogleWeatherResponse {
  currentTime: string;
  timeZone: { id: string };
  isDaytime: boolean;
  weatherCondition: GoogleWeatherCondition;
  temperature: GoogleTemperature;
  feelsLikeTemperature: GoogleTemperature;
  dewPoint: GoogleTemperature;
  heatIndex: GoogleTemperature;
  windChill: GoogleTemperature;
  relativeHumidity: number;
  uvIndex: number;
  precipitation: GooglePrecipitation;
  thunderstormProbability: number;
  airPressure: { meanSeaLevelMillibars: number };
  wind: GoogleWind;
  visibility: { distance: number; unit: string };
  cloudCover: number;
  currentConditionsHistory: GoogleCurrentConditionsHistory;
}
