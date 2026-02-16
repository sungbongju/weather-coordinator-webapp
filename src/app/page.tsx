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
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

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
  const { location, error: geoError, isLoading: geoLoading } = useGeolocation();
  const { weatherData, isLoading: weatherLoading, error: weatherError, refetch } = useWeather(location);
  const { recommendation } = useOutfit(weatherData);

  const isLoading = geoLoading || weatherLoading;

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
            isLoading={geoLoading}
            error={geoError}
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
    </div>
  );
}
