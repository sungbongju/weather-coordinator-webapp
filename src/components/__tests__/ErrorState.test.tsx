import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState } from '../ErrorState';

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

  it('에러 아이콘을 표시한다', () => {
    render(<ErrorState message="오류" onRetry={() => {}} />);
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });
});
