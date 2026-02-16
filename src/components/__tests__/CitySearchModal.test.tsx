import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CitySearchModal } from '../CitySearchModal';
import type { CitySearchResult } from '@/types/location';

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

// useCitySearch mock
const mockSetQuery = vi.fn();
const mockClearResults = vi.fn();
let mockSearchState = {
  query: '',
  results: [] as CitySearchResult[],
  isSearching: false,
  error: null as string | null,
};

vi.mock('@/hooks/useCitySearch', () => ({
  useCitySearch: () => ({
    ...mockSearchState,
    setQuery: mockSetQuery,
    clearResults: mockClearResults,
  }),
}));

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onSelectCity: vi.fn(),
  onSelectCurrentLocation: vi.fn(),
};

describe('CitySearchModal', () => {
  beforeEach(() => {
    mockSearchState = {
      query: '',
      results: [],
      isSearching: false,
      error: null,
    };
    vi.clearAllMocks();
  });

  it('isOpen이 false이면 렌더하지 않는다', () => {
    render(<CitySearchModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('도시 검색')).not.toBeInTheDocument();
  });

  it('isOpen이 true이면 검색 입력을 표시한다', () => {
    render(<CitySearchModal {...defaultProps} />);
    expect(screen.getByText('도시 검색')).toBeInTheDocument();
    expect(screen.getByTestId('city-search-input')).toBeInTheDocument();
  });

  it('현재 위치 사용 버튼을 표시한다', () => {
    render(<CitySearchModal {...defaultProps} />);
    expect(screen.getByText('현재 위치 사용')).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose를 호출한다', () => {
    render(<CitySearchModal {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('닫기'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('현재 위치 버튼 클릭 시 onSelectCurrentLocation을 호출한다', () => {
    render(<CitySearchModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('current-location-btn'));
    expect(defaultProps.onSelectCurrentLocation).toHaveBeenCalledTimes(1);
  });

  it('검색 결과를 클릭하면 onSelectCity를 호출한다', () => {
    const city: CitySearchResult = {
      displayName: '도쿄',
      country: 'JP',
      latitude: 35.6762,
      longitude: 139.6503,
    };
    mockSearchState = { ...mockSearchState, query: 'Tokyo', results: [city] };

    render(<CitySearchModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('city-result'));
    expect(defaultProps.onSelectCity).toHaveBeenCalledWith(city);
  });

  it('검색 중일 때 스피너를 표시한다', () => {
    mockSearchState = { ...mockSearchState, query: 'To', isSearching: true };

    render(<CitySearchModal {...defaultProps} />);
    expect(screen.getByTestId('search-spinner')).toBeInTheDocument();
  });

  it('결과가 없을 때 안내 메시지를 표시한다', () => {
    mockSearchState = { ...mockSearchState, query: 'xyzabc', results: [] };

    render(<CitySearchModal {...defaultProps} />);
    expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument();
  });
});
