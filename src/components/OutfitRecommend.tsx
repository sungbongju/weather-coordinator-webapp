'use client';

import type { OutfitRecommendation, ClothingItem } from '@/types/outfit';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { getTempLabel } from '@/lib/weatherMapping';
import { ClothingItemCard } from './ClothingItemCard';
import { OutfitComment } from './OutfitComment';
import { ConditionBadges } from './ConditionBadges';

interface OutfitRecommendProps {
  recommendation: OutfitRecommendation | null;
  isLoading?: boolean;
}

function OutfitSkeleton() {
  return (
    <div data-testid="outfit-skeleton" className="glass-card-heavy p-6">
      <div className="space-y-5">
        <div className="h-5 w-24 rounded skeleton-shimmer" />
        <div className="flex justify-center gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-24 w-24 rounded-3xl skeleton-shimmer" />
              <div className="h-3 w-12 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
        <div className="h-12 rounded-2xl skeleton-shimmer" />
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 350, damping: 20 },
  },
};

export function OutfitRecommend({ recommendation, isLoading }: OutfitRecommendProps) {
  if (isLoading) {
    return <OutfitSkeleton />;
  }

  if (!recommendation) {
    return (
      <div className="glass-card-heavy p-6 text-center">
        <p className="text-white/70">날씨 데이터를 불러오는 중...</p>
      </div>
    );
  }

  const clothingItems = [
    recommendation.outer,
    recommendation.top,
    recommendation.bottom,
    recommendation.shoes,
  ].filter((item): item is ClothingItem => item !== null);

  return (
    <motion.div
      className="glass-card-heavy p-6 space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 온도 레벨 라벨 */}
      <motion.div variants={itemVariants} className="flex items-center gap-2">
        <Sparkles size={14} className="text-accent" />
        <div>
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">오늘의 코디</p>
          <p className="text-2xl font-extrabold text-white">
            {getTempLabel(recommendation.tempLevel)}
          </p>
        </div>
      </motion.div>

      {/* 의류 카드 그리드 */}
      <motion.div
        className="flex flex-wrap justify-center gap-5"
        variants={itemVariants}
      >
        {clothingItems.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
          >
            <ClothingItemCard item={item} />
          </motion.div>
        ))}
      </motion.div>

      {/* 악세서리 */}
      {recommendation.accessories.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-white/10" />
            <div className="flex items-center gap-1.5 text-xs font-medium text-white/40 uppercase tracking-wider">
              <ShoppingBag size={12} />
              <span>액세서리</span>
            </div>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {recommendation.accessories.map((acc) => (
              <ClothingItemCard key={acc.id} item={acc} />
            ))}
          </div>
        </motion.div>
      )}

      {/* 조건 배지 */}
      <motion.div variants={itemVariants}>
        <ConditionBadges modifiers={recommendation.modifiers} />
      </motion.div>

      {/* 코멘트 */}
      <motion.div variants={itemVariants}>
        <OutfitComment comment={recommendation.comment} />
      </motion.div>
    </motion.div>
  );
}
