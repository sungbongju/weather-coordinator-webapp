import { GET } from '../route';
import { NextRequest } from 'next/server';

function createRequest(params: Record<string, string> = {}) {
  const url = new URL('http://localhost:3000/api/geocode');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return new NextRequest(url);
}

const mockGeocodingResponse = [
  {
    name: 'Seoul',
    local_names: { ko: '서울', ja: 'ソウル', en: 'Seoul' },
    lat: 37.5665,
    lon: 126.978,
    country: 'KR',
  },
  {
    name: 'Seoul',
    local_names: { ko: '서울' },
    lat: 37.5326,
    lon: 127.024,
    country: 'KR',
    state: 'Gyeonggi-do',
  },
];

describe('/api/geocode', () => {
  beforeEach(() => {
    vi.stubEnv('OPENWEATHER_API_KEY', 'test-key');
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('유효한 검색어로 요청 시 결과를 반환한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockGeocodingResponse), { status: 200 }),
    );

    const request = createRequest({ q: '서울' });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0].name).toBe('Seoul');
    expect(data[0].country).toBe('KR');
  });

  it('q 파라미터 누락 시 400 에러를 반환한다', async () => {
    const request = createRequest({});
    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('검색어');
  });

  it('빈 검색어 시 400 에러를 반환한다', async () => {
    const request = createRequest({ q: '  ' });
    const response = await GET(request);

    expect(response.status).toBe(400);
  });

  it('API 키 미설정 시 500 에러를 반환한다', async () => {
    vi.stubEnv('OPENWEATHER_API_KEY', '');

    const request = createRequest({ q: 'Seoul' });
    const response = await GET(request);

    expect(response.status).toBe(500);
  });

  it('OWM API 실패 시 502 에러를 반환한다', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const request = createRequest({ q: 'Seoul' });
    const response = await GET(request);

    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toContain('도시 검색에 실패');
  });

  it('OWM API가 비정상 응답 시 502 에러를 반환한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Forbidden', { status: 403 }),
    );

    const request = createRequest({ q: 'Seoul' });
    const response = await GET(request);

    expect(response.status).toBe(502);
  });
});
