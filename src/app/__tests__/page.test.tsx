import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';
import { mockWeatherMild } from '@/__tests__/fixtures/weatherData';
import { recommendOutfit } from '@/lib/outfitEngine';

// Mock hooks
const mockRefetch = vi.fn();

vi.mock('@/hooks/useGeolocation', () => ({
  useGeolocation: vi.fn(),
}));

vi.mock('@/hooks/useWeather', () => ({
  useWeather: vi.fn(),
}));

vi.mock('@/hooks/useOutfit', () => ({
  useOutfit: vi.fn(),
}));

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

import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeather } from '@/hooks/useWeather';
import { useOutfit } from '@/hooks/useOutfit';

const mockUseGeolocation = vi.mocked(useGeolocation);
const mockUseWeather = vi.mocked(useWeather);
const mockUseOutfit = vi.mocked(useOutfit);

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('헤더를 표시한다', () => {
    mockUseGeolocation.mockReturnValue({
      location: null,
      error: null,
      isLoading: true,
    });
    mockUseWeather.mockReturnValue({
      weatherData: null,
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    });
    mockUseOutfit.mockReturnValue({ recommendation: null });

    render(<Home />);
    expect(screen.getByText('WeatherFit')).toBeInTheDocument();
    expect(screen.getByText('오늘 뭐 입지?')).toBeInTheDocument();
  });

  it('로딩 상태를 표시한다', () => {
    mockUseGeolocation.mockReturnValue({
      location: { latitude: 37.5, longitude: 127.0 },
      error: null,
      isLoading: false,
    });
    mockUseWeather.mockReturnValue({
      weatherData: null,
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    });
    mockUseOutfit.mockReturnValue({ recommendation: null });

    render(<Home />);
    expect(screen.getByTestId('outfit-skeleton')).toBeInTheDocument();
  });

  it('날씨 + 코디 추천을 정상 렌더한다', () => {
    const recommendation = recommendOutfit(mockWeatherMild);

    mockUseGeolocation.mockReturnValue({
      location: { latitude: 37.5, longitude: 127.0 },
      error: null,
      isLoading: false,
    });
    mockUseWeather.mockReturnValue({
      weatherData: mockWeatherMild,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });
    mockUseOutfit.mockReturnValue({ recommendation });

    render(<Home />);
    expect(screen.getByText('15°')).toBeInTheDocument();
    expect(screen.getByText(recommendation.top.name)).toBeInTheDocument();
  });

  it('에러 상태를 표시한다', () => {
    mockUseGeolocation.mockReturnValue({
      location: { latitude: 37.5, longitude: 127.0 },
      error: null,
      isLoading: false,
    });
    mockUseWeather.mockReturnValue({
      weatherData: null,
      isLoading: false,
      error: '날씨 데이터를 가져오는 데 실패했습니다.',
      refetch: mockRefetch,
    });
    mockUseOutfit.mockReturnValue({ recommendation: null });

    render(<Home />);
    expect(screen.getByText('날씨 데이터를 가져오는 데 실패했습니다.')).toBeInTheDocument();
    expect(screen.getByText('다시 시도')).toBeInTheDocument();
  });

  it('새로고침 버튼 클릭 시 refetch를 호출한다', () => {
    mockUseGeolocation.mockReturnValue({
      location: { latitude: 37.5, longitude: 127.0 },
      error: null,
      isLoading: false,
    });
    mockUseWeather.mockReturnValue({
      weatherData: mockWeatherMild,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });
    mockUseOutfit.mockReturnValue({ recommendation: recommendOutfit(mockWeatherMild) });

    render(<Home />);
    fireEvent.click(screen.getByRole('button', { name: '새로고침' }));
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
