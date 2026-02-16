import { useLocationStore } from '../locationStore';
import type { SelectedLocation } from '@/types/location';

const mockLocation: SelectedLocation = {
  latitude: 35.6762,
  longitude: 139.6503,
  cityName: '東京',
  country: 'JP',
  source: 'search',
};

describe('locationStore', () => {
  beforeEach(() => {
    useLocationStore.setState({
      selectedLocation: null,
      isSearchModalOpen: false,
    });
    localStorage.clear();
  });

  it('초기 상태가 올바르다', () => {
    const state = useLocationStore.getState();
    expect(state.selectedLocation).toBeNull();
    expect(state.isSearchModalOpen).toBe(false);
  });

  it('setSelectedLocation으로 위치를 설정한다', () => {
    useLocationStore.getState().setSelectedLocation(mockLocation);
    expect(useLocationStore.getState().selectedLocation).toEqual(mockLocation);
  });

  it('setSelectedLocation은 localStorage에 저장한다', () => {
    useLocationStore.getState().setSelectedLocation(mockLocation);
    const stored = localStorage.getItem('weatherfit-location');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!).cityName).toBe('東京');
  });

  it('clearSelectedLocation은 상태와 localStorage를 초기화한다', () => {
    useLocationStore.getState().setSelectedLocation(mockLocation);
    useLocationStore.getState().clearSelectedLocation();

    expect(useLocationStore.getState().selectedLocation).toBeNull();
    expect(localStorage.getItem('weatherfit-location')).toBeNull();
  });

  it('openSearchModal / closeSearchModal 토글', () => {
    useLocationStore.getState().openSearchModal();
    expect(useLocationStore.getState().isSearchModalOpen).toBe(true);

    useLocationStore.getState().closeSearchModal();
    expect(useLocationStore.getState().isSearchModalOpen).toBe(false);
  });

  it('hydrateFromStorage는 유효한 데이터를 복원한다', () => {
    localStorage.setItem('weatherfit-location', JSON.stringify(mockLocation));

    useLocationStore.getState().hydrateFromStorage();

    const loc = useLocationStore.getState().selectedLocation;
    expect(loc).not.toBeNull();
    expect(loc!.cityName).toBe('東京');
    expect(loc!.source).toBe('stored');
  });

  it('hydrateFromStorage는 손상된 데이터를 무시한다', () => {
    localStorage.setItem('weatherfit-location', 'invalid-json');

    useLocationStore.getState().hydrateFromStorage();

    expect(useLocationStore.getState().selectedLocation).toBeNull();
  });

  it('hydrateFromStorage는 빈 localStorage에서 아무것도 하지 않는다', () => {
    useLocationStore.getState().hydrateFromStorage();
    expect(useLocationStore.getState().selectedLocation).toBeNull();
  });
});
