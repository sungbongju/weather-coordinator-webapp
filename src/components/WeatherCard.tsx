'use client';

import type { WeatherData } from '@/types/weather';
import type { LucideIcon } from 'lucide-react';
import { CloudRain, Wind, Sun, Droplets } from 'lucide-react';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

interface WeatherCardProps {
  data: WeatherData | null;
  isLoading?: boolean;
  className?: string;
}

function WeatherDetailPill({ Icon, label, value }: { Icon: LucideIcon; label: string; value: string }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 px-4 py-3 min-w-[80px]"
      whileHover={{ y: -3 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 15 }}
    >
      <Icon size={20} className="text-white/70" />
      <span className="text-xs text-white/60">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </motion.div>
  );
}

function WeatherCardSkeleton() {
  return (
    <div className="glass-card p-6">
      <div className="space-y-4">
        <div className="h-4 w-20 rounded skeleton-shimmer" />
        <div className="h-12 w-32 rounded skeleton-shimmer" />
        <div className="h-4 w-24 rounded skeleton-shimmer" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 w-20 rounded-2xl skeleton-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function WeatherCard({ data, isLoading, className }: WeatherCardProps) {
  if (isLoading || !data) {
    return <WeatherCardSkeleton />;
  }

  return (
    <div className={cn('glass-card p-6', className)}>
      {/* 날씨 상태 */}
      <p className="text-sm font-medium text-white/70">
        {data.conditionText}
      </p>

      {/* 온도 */}
      <div className="mt-2 flex items-baseline gap-2">
        <motion.span
          className="text-6xl font-extrabold tracking-tighter text-white text-shadow-sm"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
        >
          {Math.round(data.temperature)}°
        </motion.span>
        <span className="text-lg text-white/60">
          체감 {Math.round(data.feelsLike)}°
        </span>
      </div>

      {/* 최저/최고 */}
      <p className="mt-1 text-sm text-white/50">
        최저 {Math.round(data.tempMin)}° / 최고 {Math.round(data.tempMax)}°
      </p>

      {/* 날씨 상세 정보 */}
      <div className="mt-4 flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        <WeatherDetailPill
          Icon={CloudRain}
          label="강수"
          value={`${data.precipitationProbability}%`}
        />
        <WeatherDetailPill
          Icon={Wind}
          label="바람"
          value={`${Math.round(data.windSpeed)}km/h`}
        />
        <WeatherDetailPill
          Icon={Sun}
          label="UV"
          value={`${data.uvIndex}`}
        />
        <WeatherDetailPill
          Icon={Droplets}
          label="습도"
          value={`${data.humidity}%`}
        />
      </div>
    </div>
  );
}
