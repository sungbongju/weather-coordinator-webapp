'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeather } from '@/hooks/useWeather';
import { useOutfit } from '@/hooks/useOutfit';
import { useLocationStore } from '@/store/locationStore';
import { getWeatherBackground } from '@/lib/weatherMapping';
import { WeatherCard } from '@/components/WeatherCard';
import { OutfitRecommend } from '@/components/OutfitRecommend';
import { LocationBar } from '@/components/LocationBar';
import { ErrorState } from '@/components/ErrorState';
import { CitySearchModal } from '@/components/CitySearchModal';
import { cn } from '@/lib/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { CitySearchResult } from '@/types/location';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

export default function Home() {
  // Location store
  const {
    selectedLocation,
    setSelectedLocation,
    isSearchModalOpen,
    openSearchModal,
    closeSearchModal,
    hydrateFromStorage,
  } = useLocationStore();

  // GPS geolocation (항상 실행, fallback 용도)
  const { location: gpsLocation, isLoading: geoLoading } = useGeolocation();

  // localStorage에서 복원
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  // 유효 위치 결정: store 우선, 없으면 GPS
  const effectiveLocation = useMemo(() => {
    if (selectedLocation) {
      return { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude };
    }
    return gpsLocation;
  }, [selectedLocation, gpsLocation]);

  // Weather & outfit
  const { weatherData, isLoading: weatherLoading, error: weatherError, refetch } = useWeather(effectiveLocation);
  const { recommendation } = useOutfit(weatherData);

  const isLoading = geoLoading || weatherLoading;

  // 도시 이름: store 우선, 없으면 weatherData에서
  const displayCityName = selectedLocation?.cityName
    || weatherData?.cityName
    || null;

  const locationSource = selectedLocation?.source || (gpsLocation ? 'gps' : null);

  // 도시 선택 핸들러
  const handleSelectCity = useCallback((city: CitySearchResult) => {
    setSelectedLocation({
      latitude: city.latitude,
      longitude: city.longitude,
      cityName: city.displayName,
      country: city.country,
      state: city.state,
      source: 'search',
    });
    closeSearchModal();
  }, [setSelectedLocation, closeSearchModal]);

  // 현재 위치 선택 핸들러
  const handleSelectCurrentLocation = useCallback(() => {
    if (gpsLocation) {
      setSelectedLocation({
        latitude: gpsLocation.latitude,
        longitude: gpsLocation.longitude,
        cityName: weatherData?.cityName || '현재 위치',
        country: '',
        source: 'gps',
      });
    }
    closeSearchModal();
  }, [gpsLocation, weatherData, setSelectedLocation, closeSearchModal]);

  const bgClass = weatherData
    ? getWeatherBackground(weatherData.condition, weatherData.isDaytime)
    : 'bg-weather-default';

  return (
    <div className={cn('min-h-screen transition-all duration-1000', bgClass)}>
      <motion.main
        className="mx-auto max-w-lg px-4 py-8 space-y-4"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 헤더 */}
        <motion.div className="mb-2" variants={sectionVariants}>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-extrabold text-gradient-primary">
              WeatherFit
            </h1>
            <motion.div
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={24} className="text-accent" />
            </motion.div>
          </div>
          <p className="mt-1 text-white/80">오늘 뭐 입지?</p>
        </motion.div>

        {/* 위치 바 */}
        <motion.div variants={sectionVariants}>
          <LocationBar
            isLoading={geoLoading && !selectedLocation}
            cityName={displayCityName}
            locationSource={locationSource}
            onOpenSearch={openSearchModal}
            onRefresh={refetch}
          />
        </motion.div>

        {/* 에러 상태 */}
        <AnimatePresence mode="wait">
          {weatherError && !weatherLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
            >
              <ErrorState message={weatherError} onRetry={refetch} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 날씨 카드 */}
        {!weatherError && (
          <motion.div variants={sectionVariants}>
            <WeatherCard data={weatherData} isLoading={isLoading} />
          </motion.div>
        )}

        {/* 코디 추천 */}
        {!weatherError && (
          <motion.div variants={sectionVariants}>
            <OutfitRecommend
              recommendation={recommendation}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </motion.main>

      {/* 도시 검색 모달 */}
      <CitySearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        onSelectCity={handleSelectCity}
        onSelectCurrentLocation={handleSelectCurrentLocation}
      />
    </div>
  );
}
