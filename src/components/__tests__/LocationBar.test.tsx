import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocationBar } from '../LocationBar';

describe('LocationBar', () => {
  it('위치 기반 텍스트를 표시한다', () => {
    render(<LocationBar isLoading={false} error={null} onRefresh={() => {}} />);
    expect(screen.getByText('현재 위치 기반')).toBeInTheDocument();
  });

  it('에러 메시지를 표시한다', () => {
    render(
      <LocationBar
        isLoading={false}
        error="위치 권한이 거부되었습니다"
        onRefresh={() => {}}
      />,
    );
    expect(screen.getByText('서울(기본) 기준')).toBeInTheDocument();
  });

  it('새로고침 버튼 클릭 시 onRefresh를 호출한다', () => {
    const onRefresh = vi.fn();
    render(<LocationBar isLoading={false} error={null} onRefresh={onRefresh} />);
    fireEvent.click(screen.getByRole('button', { name: '새로고침' }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
