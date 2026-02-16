import { NextRequest, NextResponse } from 'next/server';
import type { NaverImageResponse, ClothingImage } from '@/types/image';

const NAVER_IMAGE_API = 'https://openapi.naver.com/v1/search/image';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('query');
  const display = searchParams.get('display') ?? '8';

  if (!query) {
    return NextResponse.json(
      { error: 'query 파라미터가 필요합니다.' },
      { status: 400 },
    );
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: '네이버 API 키가 설정되지 않았습니다.' },
      { status: 500 },
    );
  }

  try {
    const searchQuery = `${query} 패션 코디`;
    const url = `${NAVER_IMAGE_API}?query=${encodeURIComponent(searchQuery)}&display=${display}&sort=sim&filter=large`;

    const response = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `네이버 API 오류: ${response.status} ${errorText}` },
        { status: 502 },
      );
    }

    const data: NaverImageResponse = await response.json();

    const images: ClothingImage[] = data.items.map((item) => ({
      title: item.title.replace(/<[^>]*>/g, ''),
      link: item.link,
      thumbnail: item.thumbnail,
      width: parseInt(item.sizewidth, 10) || 0,
      height: parseInt(item.sizeheight, 10) || 0,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `이미지 검색에 실패했습니다: ${message}` },
      { status: 502 },
    );
  }
}
