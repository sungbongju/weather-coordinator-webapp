import { NextRequest, NextResponse } from 'next/server';

const OWM_GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: '검색어가 필요합니다.' },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is not configured' },
      { status: 500 },
    );
  }

  try {
    const url = `${OWM_GEO_URL}?q=${encodeURIComponent(query.trim())}&limit=5&appid=${apiKey}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`OWM Geocoding API error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `도시 검색에 실패했습니다: ${message}` },
      { status: 502 },
    );
  }
}
