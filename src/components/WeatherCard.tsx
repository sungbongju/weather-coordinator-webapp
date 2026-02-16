'use client';

import type { WeatherData } from '@/types/weather';
import { cn } from '@/lib/cn';

interface WeatherCardProps {
  data: WeatherData | null;
  isLoading?: boolean;
  className?: string;
}

function WeatherDetailPill({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 px-4 py-3 min-w-[80px]">
      <span className="text-lg">{icon}</span>
      <span className="text-xs text-white/60">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function WeatherCardSkeleton() {
  return (
    <div className="glass-card p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-20 rounded bg-white/20" />
        <div className="h-12 w-32 rounded bg-white/20" />
        <div className="h-4 w-24 rounded bg-white/20" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 w-20 rounded-2xl bg-white/10" />
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
        <span className="text-5xl font-bold tracking-tight text-white text-shadow-sm">
          {Math.round(data.temperature)}°
        </span>
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
          icon="💧"
          label="강수"
          value={`${data.precipitationProbability}%`}
        />
        <WeatherDetailPill
          icon="💨"
          label="바람"
          value={`${Math.round(data.windSpeed)}km/h`}
        />
        <WeatherDetailPill
          icon="☀️"
          label="UV"
          value={`${data.uvIndex}`}
        />
        <WeatherDetailPill
          icon="💦"
          label="습도"
          value={`${data.humidity}%`}
        />
      </div>
    </div>
  );
}
