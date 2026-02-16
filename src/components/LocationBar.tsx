'use client';

import { MapPin, Loader2, RefreshCw, Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LocationSource } from '@/types/location';

interface LocationBarProps {
  isLoading: boolean;
  cityName: string | null;
  locationSource: LocationSource | null;
  onOpenSearch: () => void;
  onRefresh: () => void;
}

function getLocationText(
  isLoading: boolean,
  cityName: string | null,
  locationSource: LocationSource | null,
): string {
  if (isLoading) return '위치 확인 중...';
  if (cityName) return cityName;
  return '위치를 선택하세요';
}

function getLocationIcon(locationSource: LocationSource | null) {
  if (locationSource === 'search' || locationSource === 'stored') return Search;
  return MapPin;
}

export function LocationBar({ isLoading, cityName, locationSource, onOpenSearch, onRefresh }: LocationBarProps) {
  const Icon = getLocationIcon(locationSource);

  return (
    <motion.div
      className="flex items-center justify-between rounded-full bg-white/15 px-4 py-2.5 backdrop-blur-sm border border-white/15 shadow-glass-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
    >
      <button
        onClick={onOpenSearch}
        className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
        aria-label="도시 검색"
        data-testid="location-search-btn"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin text-white/60" />
        ) : (
          <Icon size={16} className="text-secondary" />
        )}
        <span>{getLocationText(isLoading, cityName, locationSource)}</span>
        {!isLoading && <ChevronDown size={14} className="text-white/40" />}
      </button>
      <motion.button
        onClick={onRefresh}
        aria-label="새로고침"
        className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        whileHover={{ rotate: 180 }}
        transition={{ type: 'spring' as const, stiffness: 200, damping: 10 }}
      >
        <RefreshCw size={16} />
      </motion.button>
    </motion.div>
  );
}
