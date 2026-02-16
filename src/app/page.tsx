'use client';

import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeather } from '@/hooks/useWeather';
import { useOutfit } from '@/hooks/useOutfit';
import { getWeatherBackground } from '@/lib/weatherMapping';
import { WeatherCard } from '@/components/WeatherCard';
import { OutfitRecommend } from '@/components/OutfitRecommend';
import { LocationBar } from '@/components/LocationBar';
import { ErrorState } from '@/components/ErrorState';
import { cn } from '@/lib/cn';

export default function Home() {
  const { location, error: geoError, isLoading: geoLoading } = useGeolocation();
  const { weatherData, isLoading: weatherLoading, error: weatherError, refetch } = useWeather(location);
  const { recommendation } = useOutfit(weatherData);

  const isLoading = geoLoading || weatherLoading;

  const bgClass = weatherData
    ? getWeatherBackground(weatherData.condition, weatherData.isDaytime)
    : 'bg-weather-default';

  return (
    <div className={cn('min-h-screen transition-all duration-700', bgClass)}>
      <main className="mx-auto max-w-lg px-4 py-8 space-y-4">
        {/* 헤더 */}
        <div className="mb-2 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white text-shadow-sm">
            WeatherFit
          </h1>
          <p className="mt-1 text-white/80">오늘 뭐 입지?</p>
        </div>

        {/* 위치 바 */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <LocationBar
            isLoading={geoLoading}
            error={geoError}
            onRefresh={refetch}
          />
        </div>

        {/* 에러 상태 */}
        {weatherError && !weatherLoading && (
          <div className="animate-fade-in-up">
            <ErrorState message={weatherError} onRetry={refetch} />
          </div>
        )}

        {/* 날씨 카드 */}
        {!weatherError && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <WeatherCard data={weatherData} isLoading={isLoading} />
          </div>
        )}

        {/* 코디 추천 */}
        {!weatherError && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <OutfitRecommend
              recommendation={recommendation}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>
    </div>
  );
}
