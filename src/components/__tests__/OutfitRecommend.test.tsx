import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OutfitRecommend } from '../OutfitRecommend';
import type { OutfitRecommendation } from '@/types/outfit';
import { recommendOutfit } from '@/lib/outfitEngine';
import { mockWeatherMild, mockWeatherWarm, mockWeatherRainyMild } from '@/__tests__/fixtures/weatherData';

// framer-motion mock for testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, variants, whileHover, whileTap, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

function getMockRecommendation(weatherData = mockWeatherMild): OutfitRecommendation {
  return recommendOutfit(weatherData);
}

describe('OutfitRecommend', () => {
  it('추천 결과의 아이템 이름들을 표시한다', () => {
    const rec = getMockRecommendation();
    render(<OutfitRecommend recommendation={rec} />);
    expect(screen.getByText(rec.top.name)).toBeInTheDocument();
    expect(screen.getByText(rec.bottom.name)).toBeInTheDocument();
    expect(screen.getByText(rec.shoes.name)).toBeInTheDocument();
  });

  it('outer가 null이면 아우터 카드를 표시하지 않는다', () => {
    const rec = getMockRecommendation(mockWeatherWarm);
    expect(rec.outer).toBeNull();
    render(<OutfitRecommend recommendation={rec} />);
    expect(screen.queryByText('🧥')).not.toBeInTheDocument();
  });

  it('outer가 있으면 아우터 카드를 표시한다', () => {
    const rec = getMockRecommendation(mockWeatherMild);
    expect(rec.outer).not.toBeNull();
    render(<OutfitRecommend recommendation={rec} />);
    expect(screen.getByText(rec.outer!.name)).toBeInTheDocument();
  });

  it('코멘트를 표시한다', () => {
    const rec = getMockRecommendation();
    render(<OutfitRecommend recommendation={rec} />);
    expect(screen.getByText(rec.comment)).toBeInTheDocument();
  });

  it('isLoading일 때 스켈레톤을 표시한다', () => {
    render(<OutfitRecommend recommendation={null} isLoading />);
    expect(screen.getByTestId('outfit-skeleton')).toBeInTheDocument();
  });

  it('recommendation이 null이면 안내 문구를 표시한다', () => {
    render(<OutfitRecommend recommendation={null} />);
    expect(screen.getByText('날씨 데이터를 불러오는 중...')).toBeInTheDocument();
  });
});
