import { GET } from '../route';
import { NextRequest } from 'next/server';

function createRequest(params: Record<string, string> = {}) {
  const url = new URL('http://localhost:3000/api/images');
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return new NextRequest(url);
}

const mockNaverResponse = {
  lastBuildDate: 'Mon, 01 Jan 2024 00:00:00 +0900',
  total: 1000,
  start: 1,
  display: 2,
  items: [
    {
      title: '<b>패딩</b> 코디',
      link: 'https://example.com/image1.jpg',
      thumbnail: 'https://example.com/thumb1.jpg',
      sizeheight: '600',
      sizewidth: '400',
    },
    {
      title: '겨울 <b>패딩</b>',
      link: 'https://example.com/image2.jpg',
      thumbnail: 'https://example.com/thumb2.jpg',
      sizeheight: '800',
      sizewidth: '600',
    },
  ],
};

describe('/api/images', () => {
  beforeEach(() => {
    vi.stubEnv('NAVER_CLIENT_ID', 'test-client-id');
    vi.stubEnv('NAVER_CLIENT_SECRET', 'test-client-secret');
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('유효한 query로 요청 시 이미지 데이터를 반환한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockNaverResponse), { status: 200 }),
    );

    const request = createRequest({ query: '패딩' });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.images).toHaveLength(2);
    expect(data.images[0].title).toBe('패딩 코디');
    expect(data.images[0].link).toBe('https://example.com/image1.jpg');
    expect(data.images[0].thumbnail).toBe('https://example.com/thumb1.jpg');
  });

  it('HTML 태그가 제거된 title을 반환한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockNaverResponse), { status: 200 }),
    );

    const request = createRequest({ query: '패딩' });
    const response = await GET(request);
    const data = await response.json();

    expect(data.images[0].title).not.toContain('<b>');
    expect(data.images[0].title).toBe('패딩 코디');
  });

  it('query 파라미터 누락 시 400 에러를 반환한다', async () => {
    const request = createRequest({});
    const response = await GET(request);

    expect(response.status).toBe(400);
  });

  it('네이버 API 키 미설정 시 500 에러를 반환한다', async () => {
    vi.unstubAllEnvs();
    vi.stubEnv('NAVER_CLIENT_ID', '');
    vi.stubEnv('NAVER_CLIENT_SECRET', '');

    const request = createRequest({ query: '패딩' });
    const response = await GET(request);

    expect(response.status).toBe(500);
  });

  it('네이버 API 실패 시 502 에러를 반환한다', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const request = createRequest({ query: '패딩' });
    const response = await GET(request);

    expect(response.status).toBe(502);
  });

  it('네이버 API가 에러 상태를 반환하면 502를 반환한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401 }),
    );

    const request = createRequest({ query: '패딩' });
    const response = await GET(request);

    expect(response.status).toBe(502);
  });
});
