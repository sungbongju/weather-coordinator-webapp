import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocationBar } from '../LocationBar';

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

const defaultProps = {
  isLoading: false,
  cityName: null as string | null,
  locationSource: null as 'gps' | 'search' | 'stored' | null,
  onOpenSearch: vi.fn(),
  onRefresh: vi.fn(),
};

describe('LocationBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('로딩 중일 때 "위치 확인 중..."을 표시한다', () => {
    render(<LocationBar {...defaultProps} isLoading={true} />);
    expect(screen.getByText('위치 확인 중...')).toBeInTheDocument();
  });

  it('도시 이름이 있으면 표시한다', () => {
    render(<LocationBar {...defaultProps} cityName="서울" locationSource="gps" />);
    expect(screen.getByText('서울')).toBeInTheDocument();
  });

  it('도시 이름이 없으면 안내 텍스트를 표시한다', () => {
    render(<LocationBar {...defaultProps} />);
    expect(screen.getByText('위치를 선택하세요')).toBeInTheDocument();
  });

  it('위치 영역 클릭 시 onOpenSearch를 호출한다', () => {
    render(<LocationBar {...defaultProps} />);
    fireEvent.click(screen.getByTestId('location-search-btn'));
    expect(defaultProps.onOpenSearch).toHaveBeenCalledTimes(1);
  });

  it('새로고침 버튼 클릭 시 onRefresh를 호출한다', () => {
    render(<LocationBar {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '새로고침' }));
    expect(defaultProps.onRefresh).toHaveBeenCalledTimes(1);
  });

  it('검색 소스일 때도 도시 이름을 표시한다', () => {
    render(<LocationBar {...defaultProps} cityName="도쿄" locationSource="search" />);
    expect(screen.getByText('도쿄')).toBeInTheDocument();
  });
});
