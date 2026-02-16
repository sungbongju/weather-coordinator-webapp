import { useMemo } from 'react';
import type { WeatherData } from '@/types/weather';
import type { OutfitRecommendation } from '@/types/outfit';
import { recommendOutfit } from '@/lib/outfitEngine';

interface UseOutfitReturn {
  recommendation: OutfitRecommendation | null;
}

export function useOutfit(weatherData: WeatherData | null): UseOutfitReturn {
  const recommendation = useMemo(() => {
    if (!weatherData) return null;
    return recommendOutfit(weatherData);
  }, [weatherData]);

  return { recommendation };
}
