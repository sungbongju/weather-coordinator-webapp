import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OutfitRecommend } from '../OutfitRecommend';
import type { OutfitRecommendation } from '@/types/outfit';
import { recommendOutfit } from '@/lib/outfitEngine';
import { mockWeatherMild, mockWeatherWarm, mockWeatherRainyMild } from '@/__tests__/fixtures/weatherData';

// framer-motion Proxy mock
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop: string) => {
      return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        const { initial, animate, exit, transition, variants, whileHover, whileTap, ...rest } = props;
        const Tag = prop as keyof JSX.IntrinsicElements;
        return <Tag {...rest}>{children}</Tag>;
      };
    },
  }),
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// ClothingPhotoModal mock
vi.mock('../ClothingPhotoModal', () => ({
  ClothingPhotoModal: ({ item, onClose }: { item: unknown; onClose: () => void }) => {
    if (!item) return null;
    return <div data-testid="photo-modal"><button onClick={onClose}>닫기</button></div>;
  },
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
    expect(screen.queryByText('아우터')).not.toBeInTheDocument();
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

  it('의류 카드 클릭 시 사진 모달이 열린다', () => {
    const rec = getMockRecommendation();
    render(<OutfitRecommend recommendation={rec} />);

    // 모달이 처음엔 없음
    expect(screen.queryByTestId('photo-modal')).not.toBeInTheDocument();

    // 아이템 클릭
    fireEvent.click(screen.getByText(rec.top.name));

    // 모달 표시됨
    expect(screen.getByTestId('photo-modal')).toBeInTheDocument();
  });
});
