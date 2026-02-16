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

// locationStore mock
const mockLocationStore = {
  selectedLocation: null as { latitude: number; longitude: number; cityName: string; country: string; source: string } | null,
  isSearchModalOpen: false,
  setSelectedLocation: vi.fn(),
  clearSelectedLocation: vi.fn(),
  openSearchModal: vi.fn(),
  closeSearchModal: vi.fn(),
  hydrateFromStorage: vi.fn(),
};

vi.mock('@/store/locationStore', () => ({
  useLocationStore: () => mockLocationStore,
}));

// CitySearchModal mock
vi.mock('@/components/CitySearchModal', () => ({
  CitySearchModal: ({ isOpen }: { isOpen: boolean }) => {
    if (!isOpen) return null;
    return <div data-testid="city-search-modal">도시 검색 모달</div>;
  },
}));

// PreferencesModal mock
vi.mock('@/components/PreferencesModal', () => ({
  PreferencesModal: ({ isOpen }: { isOpen: boolean }) => {
    if (!isOpen) return null;
    return <div data-testid="preferences-modal">옷장 설정 모달</div>;
  },
}));

// GenderToggle mock
vi.mock('@/components/GenderToggle', () => ({
  GenderToggle: () => <div data-testid="gender-toggle">Gender Toggle</div>,
}));

// preferenceStore mock
const mockPreferenceStore: Record<string, unknown> = {
  preferences: { dislikedItemIds: [], gender: null },
  isPreferencesModalOpen: false,
  openPreferencesModal: vi.fn(),
  closePreferencesModal: vi.fn(),
  hydrateFromStorage: vi.fn(),
  toggleDislike: vi.fn(),
  isDisliked: vi.fn(() => false),
  clearAllDislikes: vi.fn(),
  setGender: vi.fn(),
};

vi.mock('@/store/preferenceStore', () => ({
  usePreferenceStore: (selector?: (s: Record<string, unknown>) => unknown) =>
    selector ? selector(mockPreferenceStore) : mockPreferenceStore,
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

function setupDefaultMocks() {
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
}

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocationStore.selectedLocation = null;
    mockLocationStore.isSearchModalOpen = false;
    mockPreferenceStore.isPreferencesModalOpen = false;
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
    setupDefaultMocks();

    render(<Home />);
    expect(screen.getByText('15°')).toBeInTheDocument();
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
    setupDefaultMocks();

    render(<Home />);
    fireEvent.click(screen.getByRole('button', { name: '새로고침' }));
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('앱 시작 시 hydrateFromStorage를 호출한다', () => {
    setupDefaultMocks();

    render(<Home />);
    expect(mockLocationStore.hydrateFromStorage).toHaveBeenCalled();
  });

  it('도시 검색 버튼 클릭 시 openSearchModal을 호출한다', () => {
    setupDefaultMocks();

    render(<Home />);
    fireEvent.click(screen.getByTestId('location-search-btn'));
    expect(mockLocationStore.openSearchModal).toHaveBeenCalledTimes(1);
  });

  it('selectedLocation이 있으면 도시 이름을 표시한다', () => {
    mockLocationStore.selectedLocation = {
      latitude: 35.68,
      longitude: 139.65,
      cityName: '도쿄',
      country: 'JP',
      source: 'search',
    };
    setupDefaultMocks();

    render(<Home />);
    expect(screen.getByText('도쿄')).toBeInTheDocument();
  });

  it('앱 시작 시 preferenceStore의 hydrateFromStorage를 호출한다', () => {
    setupDefaultMocks();
    render(<Home />);
    expect(mockPreferenceStore.hydrateFromStorage).toHaveBeenCalled();
  });

  it('설정 버튼 클릭 시 openPreferencesModal을 호출한다', () => {
    setupDefaultMocks();
    render(<Home />);
    fireEvent.click(screen.getByTestId('preferences-btn'));
    expect(mockPreferenceStore.openPreferencesModal).toHaveBeenCalledTimes(1);
  });

  it('GenderToggle이 헤더에 표시된다', () => {
    setupDefaultMocks();
    render(<Home />);
    expect(screen.getByTestId('gender-toggle')).toBeInTheDocument();
  });
});
