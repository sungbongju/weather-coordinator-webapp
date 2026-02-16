import { GET } from '../route';
import { NextRequest } from 'next/server';

function createRequest(params: Record<string, string> = {}) {
  const url = new URL('http://localhost:3000/api/weather');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return new NextRequest(url);
}

// Google Weather API 응답 목 데이터
const mockGoogleResponse = {
  currentTime: '2024-03-15T12:00:00Z',
  timeZone: { id: 'Asia/Seoul' },
  isDaytime: true,
  weatherCondition: {
    iconBaseUri: 'https://maps.gstatic.com/weather/v1/sunny',
    description: { text: '맑음', languageCode: 'ko' },
    type: 'CLEAR',
  },
  temperature: { degrees: 15, unit: 'CELSIUS' },
  feelsLikeTemperature: { degrees: 13, unit: 'CELSIUS' },
  dewPoint: { degrees: 5, unit: 'CELSIUS' },
  heatIndex: { degrees: 15, unit: 'CELSIUS' },
  windChill: { degrees: 13, unit: 'CELSIUS' },
  relativeHumidity: 55,
  uvIndex: 4,
  precipitation: {
    probability: { percent: 10, type: 'RAIN' },
    qpf: { quantity: 0, unit: 'MILLIMETERS' },
  },
  thunderstormProbability: 0,
  airPressure: { meanSeaLevelMillibars: 1013 },
  wind: {
    direction: { degrees: 270, cardinal: 'W' },
    speed: { value: 12, unit: 'KILOMETERS_PER_HOUR' },
    gust: { value: 18, unit: 'KILOMETERS_PER_HOUR' },
  },
  visibility: { distance: 10, unit: 'KILOMETERS' },
  cloudCover: 20,
  currentConditionsHistory: {
    temperatureChange: { degrees: 2, unit: 'CELSIUS' },
    maxTemperature: { degrees: 18, unit: 'CELSIUS' },
    minTemperature: { degrees: 8, unit: 'CELSIUS' },
  },
};

describe('/api/weather', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('유효한 좌표로 요청 시 날씨 데이터를 반환해야 한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockGoogleResponse), { status: 200 }),
    );

    const request = createRequest({ lat: '37.5665', lng: '126.978' });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.temperature).toBe(15);
    expect(data.feelsLike).toBe(13);
  });

  it('lat 파라미터 누락 시 400 에러를 반환해야 한다', async () => {
    const request = createRequest({ lng: '126.978' });
    const response = await GET(request);

    expect(response.status).toBe(400);
  });

  it('lng 파라미터 누락 시 400 에러를 반환해야 한다', async () => {
    const request = createRequest({ lat: '37.5665' });
    const response = await GET(request);

    expect(response.status).toBe(400);
  });

  it('유효하지 않은 좌표 시 400 에러를 반환해야 한다', async () => {
    const request = createRequest({ lat: 'abc', lng: 'def' });
    const response = await GET(request);

    expect(response.status).toBe(400);
  });

  it('Google API 실패 시 502 에러를 반환해야 한다', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Google API error'));

    const request = createRequest({ lat: '37.5665', lng: '126.978' });
    const response = await GET(request);

    expect(response.status).toBe(502);
  });

  it('응답이 WeatherData 형태로 변환되어야 한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockGoogleResponse), { status: 200 }),
    );

    const request = createRequest({ lat: '37.5665', lng: '126.978' });
    const response = await GET(request);
    const data = await response.json();

    expect(data).toHaveProperty('temperature');
    expect(data).toHaveProperty('feelsLike');
    expect(data).toHaveProperty('windSpeed');
    expect(data).toHaveProperty('precipitationProbability');
    expect(data).toHaveProperty('uvIndex');
    expect(data).toHaveProperty('condition');
    expect(data).toHaveProperty('isDaytime');
  });
});
