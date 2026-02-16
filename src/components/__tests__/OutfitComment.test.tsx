import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OutfitComment } from '../OutfitComment';

// framer-motion mock
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

describe('OutfitComment', () => {
  it('코멘트를 표시한다', () => {
    render(<OutfitComment comment="오늘은 패딩이 필수!" />);
    expect(screen.getByText('오늘은 패딩이 필수!')).toBeInTheDocument();
  });

  it('빈 문자열이면 렌더하지 않는다', () => {
    const { container } = render(<OutfitComment comment="" />);
    expect(container.innerHTML).toBe('');
  });

  it('MessageCircle 아이콘(SVG)이 표시된다', () => {
    const { container } = render(<OutfitComment comment="테스트" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
