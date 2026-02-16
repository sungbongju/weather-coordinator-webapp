import { GET } from '../route';
import { NextRequest } from 'next/server';

function createRequest(params: Record<string, string> = {}) {
  const url = new URL('http://localhost:3000/api/weather');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return new NextRequest(url);
}

// OpenWeatherMap API 응답 목 데이터
const mockOWMResponse = {
  weather: [
    { id: 800, main: 'Clear', description: '맑음', icon: '01d' },
  ],
  main: {
    temp: 15,
    feels_like: 13,
    temp_min: 8,
    temp_max: 18,
    pressure: 1013,
    humidity: 55,
  },
  wind: { speed: 3.3, deg: 270 },
  clouds: { all: 20 },
  sys: { country: 'KR', sunrise: 1710460800, sunset: 1710504000 },
  dt: 1710480000,
  timezone: 32400,
  name: 'Seoul',
};

describe('/api/weather', () => {
  beforeEach(() => {
    vi.stubEnv('OPENWEATHER_API_KEY', 'test-key');
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('유효한 좌표로 요청 시 날씨 데이터를 반환해야 한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockOWMResponse), { status: 200 }),
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

  it('OpenWeatherMap API 실패 시 502 에러를 반환해야 한다', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('API error'));

    const request = createRequest({ lat: '37.5665', lng: '126.978' });
    const response = await GET(request);

    expect(response.status).toBe(502);
  });

  it('응답이 WeatherData 형태로 변환되어야 한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockOWMResponse), { status: 200 }),
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
