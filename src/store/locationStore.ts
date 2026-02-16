import { create } from 'zustand';
import type { SelectedLocation } from '@/types/location';

const STORAGE_KEY = 'weatherfit-location';

interface LocationStore {
  selectedLocation: SelectedLocation | null;
  isSearchModalOpen: boolean;

  setSelectedLocation: (location: SelectedLocation) => void;
  clearSelectedLocation: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  hydrateFromStorage: () => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  selectedLocation: null,
  isSearchModalOpen: false,

  setSelectedLocation: (location) => {
    set({ selectedLocation: location });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    } catch {
      // localStorage 사용 불가 시 무시
    }
  },

  clearSelectedLocation: () => {
    set({ selectedLocation: null });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage 사용 불가 시 무시
    }
  },

  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),

  hydrateFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SelectedLocation;
        if (parsed.latitude && parsed.longitude && parsed.cityName) {
          set({ selectedLocation: { ...parsed, source: 'stored' } });
        }
      }
    } catch {
      // 손상된 데이터 무시
    }
  },
}));
