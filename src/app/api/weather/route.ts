import { NextRequest, NextResponse } from 'next/server';
import { fetchCurrentWeather, transformWeatherResponse } from '@/lib/weather';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  // 파라미터 검증
  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'lat과 lng 파라미터가 필요합니다.' },
      { status: 400 },
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: '유효하지 않은 좌표입니다.' },
      { status: 400 },
    );
  }

  try {
    const raw = await fetchCurrentWeather(latitude, longitude);
    const weatherData = transformWeatherResponse(raw);

    return NextResponse.json(weatherData);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `날씨 데이터를 가져오는 데 실패했습니다: ${message}` },
      { status: 502 },
    );
  }
}
