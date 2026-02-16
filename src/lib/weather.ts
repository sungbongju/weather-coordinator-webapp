import type {
  GoogleWeatherResponse,
  WeatherData,
  WeatherConditionType,
  PrecipitationType,
} from '@/types/weather';

const WEATHER_BASE_URL = 'https://weather.googleapis.com/v1';

/** Google Weather API에서 현재 날씨 데이터 가져오기 */
export async function fetchCurrentWeather(
  lat: number,
  lng: number,
): Promise<GoogleWeatherResponse> {
  const apiKey = process.env.GOOGLE_WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_WEATHER_API_KEY is not configured');
  }

  const url =
    `${WEATHER_BASE_URL}/currentConditions:lookup` +
    `?key=${apiKey}` +
    `&location.latitude=${lat}` +
    `&location.longitude=${lng}` +
    `&languageCode=ko`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Google Weather API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<GoogleWeatherResponse>;
}

/** Google API 응답 → 앱 내부 WeatherData로 변환 */
export function transformWeatherResponse(raw: GoogleWeatherResponse): WeatherData {
  const conditionType = (raw.weatherCondition?.type ?? 'CLEAR') as WeatherConditionType;
  const precipType = (raw.precipitation?.probability?.type ?? 'RAIN') as PrecipitationType;

  return {
    temperature: raw.temperature?.degrees ?? 0,
    feelsLike: raw.feelsLikeTemperature?.degrees ?? 0,
    tempMin: raw.currentConditionsHistory?.minTemperature?.degrees ?? 0,
    tempMax: raw.currentConditionsHistory?.maxTemperature?.degrees ?? 0,
    humidity: raw.relativeHumidity ?? 0,
    windSpeed: raw.wind?.speed?.value ?? 0,
    precipitationProbability: raw.precipitation?.probability?.percent ?? 0,
    precipitationType: precipType,
    uvIndex: raw.uvIndex ?? 0,
    condition: conditionType,
    conditionText: raw.weatherCondition?.description?.text ?? '',
    iconUri: raw.weatherCondition?.iconBaseUri ?? '',
    isDaytime: raw.isDaytime ?? true,
    cloudCover: raw.cloudCover ?? 0,
  };
}
