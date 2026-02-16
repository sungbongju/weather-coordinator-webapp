import { create } from 'zustand';
import type { WeatherData, GeoLocation } from '@/types/weather';

interface WeatherStore {
  weatherData: WeatherData | null;
  location: GeoLocation | null;
  isLoading: boolean;
  error: string | null;

  setWeatherData: (data: WeatherData) => void;
  setLocation: (loc: GeoLocation) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  weatherData: null as WeatherData | null,
  location: null as GeoLocation | null,
  isLoading: false,
  error: null as string | null,
};

export const useWeatherStore = create<WeatherStore>((set) => ({
  ...initialState,
  setWeatherData: (data) => set({ weatherData: data, error: null }),
  setLocation: (loc) => set({ location: loc }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set(initialState),
}));
