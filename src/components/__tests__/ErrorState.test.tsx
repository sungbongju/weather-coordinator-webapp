import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState } from '../ErrorState';

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

describe('ErrorState', () => {
  it('에러 메시지를 표시한다', () => {
    render(<ErrorState message="네트워크 오류" onRetry={() => {}} />);
    expect(screen.getByText('네트워크 오류')).toBeInTheDocument();
  });

  it('재시도 버튼 클릭 시 onRetry를 호출한다', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="오류" onRetry={onRetry} />);
    fireEvent.click(screen.getByText('다시 시도'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('에러 아이콘(SVG)을 표시한다', () => {
    const { container } = render(<ErrorState message="오류" onRetry={() => {}} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
