import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConditionBadges } from '../ConditionBadges';
import type { ConditionModifiers } from '@/types/outfit';

const noModifiers: ConditionModifiers = {
  isRainy: false,
  isSnowy: false,
  isHighUV: false,
  isWindy: false,
  hasLargeTempGap: false,
  isPoorAirQuality: false,
};

describe('ConditionBadges', () => {
  it('조건 없으면 렌더하지 않는다', () => {
    const { container } = render(<ConditionBadges modifiers={noModifiers} />);
    expect(container.innerHTML).toBe('');
  });

  it('비 조건일 때 비 배지를 표시한다', () => {
    render(<ConditionBadges modifiers={{ ...noModifiers, isRainy: true }} />);
    expect(screen.getByText('비')).toBeInTheDocument();
    expect(screen.getByText('🌧️')).toBeInTheDocument();
  });

  it('복합 조건일 때 여러 배지를 표시한다', () => {
    render(
      <ConditionBadges
        modifiers={{ ...noModifiers, isRainy: true, isWindy: true, isHighUV: true }}
      />,
    );
    expect(screen.getByText('비')).toBeInTheDocument();
    expect(screen.getByText('강풍')).toBeInTheDocument();
    expect(screen.getByText('자외선')).toBeInTheDocument();
  });

  it('일교차 배지를 표시한다', () => {
    render(<ConditionBadges modifiers={{ ...noModifiers, hasLargeTempGap: true }} />);
    expect(screen.getByText('일교차')).toBeInTheDocument();
  });
});
