import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OutfitComment } from '../OutfitComment';

describe('OutfitComment', () => {
  it('코멘트를 표시한다', () => {
    render(<OutfitComment comment="오늘은 패딩이 필수!" />);
    expect(screen.getByText('오늘은 패딩이 필수!')).toBeInTheDocument();
  });

  it('빈 문자열이면 렌더하지 않는다', () => {
    const { container } = render(<OutfitComment comment="" />);
    expect(container.innerHTML).toBe('');
  });

  it('말풍선 아이콘이 표시된다', () => {
    render(<OutfitComment comment="테스트" />);
    expect(screen.getByText('💬')).toBeInTheDocument();
  });
});
