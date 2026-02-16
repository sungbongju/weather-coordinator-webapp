'use client';

import { MapPin, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationBarProps {
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function LocationBar({ isLoading, error, onRefresh }: LocationBarProps) {
  return (
    <motion.div
      className="flex items-center justify-between rounded-full bg-white/15 px-4 py-2.5 backdrop-blur-sm border border-white/15 shadow-glass-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
    >
      <div className="flex items-center gap-2 text-sm text-white/70">
        {isLoading ? (
          <Loader2 size={16} className="animate-spin text-white/60" />
        ) : (
          <MapPin size={16} className="text-secondary" />
        )}
        <span>
          {isLoading
            ? '위치 확인 중...'
            : error
              ? '서울(기본) 기준'
              : '현재 위치 기반'}
        </span>
      </div>
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
