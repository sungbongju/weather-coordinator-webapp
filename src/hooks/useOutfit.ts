import { useMemo } from 'react';
import type { WeatherData } from '@/types/weather';
import type { OutfitRecommendation } from '@/types/outfit';
import { recommendOutfit } from '@/lib/outfitEngine';
import { usePreferenceStore } from '@/store/preferenceStore';

interface UseOutfitReturn {
  recommendation: OutfitRecommendation | null;
}

export function useOutfit(weatherData: WeatherData | null): UseOutfitReturn {
  const preferences = usePreferenceStore((s) => s.preferences);

  const recommendation = useMemo(() => {
    if (!weatherData) return null;
    return recommendOutfit(weatherData, preferences);
  }, [weatherData, preferences]);

  return { recommendation };
}
