import type {
  OWMWeatherResponse,
  WeatherData,
  WeatherConditionType,
  PrecipitationType,
} from '@/types/weather';

const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/** OpenWeatherMap에서 현재 날씨 데이터 가져오기 */
export async function fetchCurrentWeather(
  lat: number,
  lng: number,
): Promise<OWMWeatherResponse> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENWEATHER_API_KEY is not configured');
  }

  const url =
    `${OWM_BASE_URL}?lat=${lat}&lon=${lng}` +
    `&appid=${apiKey}&units=metric&lang=kr`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`OpenWeatherMap API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<OWMWeatherResponse>;
}

/** OWM weather.id → 내부 WeatherConditionType 매핑 */
function mapCondition(weatherId: number): WeatherConditionType {
  if (weatherId >= 200 && weatherId < 300) return 'THUNDERSTORM';
  if (weatherId >= 300 && weatherId < 400) return 'LIGHT_RAIN';
  if (weatherId >= 500 && weatherId < 505) {
    if (weatherId === 500) return 'LIGHT_RAIN';
    if (weatherId === 501) return 'RAIN';
    return 'HEAVY_RAIN';
  }
  if (weatherId >= 511 && weatherId < 600) return 'RAIN';
  if (weatherId >= 600 && weatherId < 700) {
    if (weatherId === 600) return 'LIGHT_SNOW';
    if (weatherId === 601) return 'SNOW';
    return 'HEAVY_SNOW';
  }
  if (weatherId >= 700 && weatherId < 800) return 'FOGGY';
  if (weatherId === 800) return 'CLEAR';
  if (weatherId === 801) return 'MOSTLY_CLEAR';
  if (weatherId === 802) return 'PARTLY_CLOUDY';
  if (weatherId === 803) return 'MOSTLY_CLOUDY';
  if (weatherId === 804) return 'CLOUDY';
  return 'CLEAR';
}

/** 강수 타입 판별 */
function mapPrecipType(weatherId: number): PrecipitationType {
  if (weatherId >= 600 && weatherId < 700) return 'SNOW';
  if (weatherId >= 611 && weatherId <= 616) return 'MIXED';
  return 'RAIN';
}

/** 현재 시간이 낮인지 판별 */
function isDaytimeNow(sunrise: number, sunset: number, dt: number): boolean {
  return dt >= sunrise && dt < sunset;
}

/** OWM 응답 → 앱 내부 WeatherData로 변환 */
export function transformWeatherResponse(raw: OWMWeatherResponse): WeatherData {
  const weather = raw.weather[0];
  const weatherId = weather?.id ?? 800;
  const conditionType = mapCondition(weatherId);
  const precipType = mapPrecipType(weatherId);

  // OWM 풍속은 m/s → km/h 변환
  const windSpeedKmh = (raw.wind?.speed ?? 0) * 3.6;

  // OWM 2.5 무료에는 강수확률이 없음 → 날씨 상태로 추정
  const isRaining = weatherId >= 200 && weatherId < 700;
  const estimatedPrecipProb = isRaining ? 80 : 0;

  return {
    temperature: raw.main?.temp ?? 0,
    feelsLike: raw.main?.feels_like ?? 0,
    tempMin: raw.main?.temp_min ?? 0,
    tempMax: raw.main?.temp_max ?? 0,
    humidity: raw.main?.humidity ?? 0,
    windSpeed: Math.round(windSpeedKmh),
    precipitationProbability: estimatedPrecipProb,
    precipitationType: precipType,
    uvIndex: 0, // 2.5 무료 API에는 UV 없음
    condition: conditionType,
    conditionText: weather?.description ?? '',
    iconUri: weather?.icon
      ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
      : '',
    isDaytime: isDaytimeNow(raw.sys?.sunrise ?? 0, raw.sys?.sunset ?? 0, raw.dt ?? 0),
    cloudCover: raw.clouds?.all ?? 0,
    cityName: raw.name || undefined,
  };
}
