'use client';

import type { OutfitRecommendation, ClothingItem } from '@/types/outfit';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="animate-pulse space-y-5">
        <div className="h-5 w-24 rounded bg-white/20" />
        <div className="flex justify-center gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-20 w-20 rounded-2xl bg-white/10" />
              <div className="h-3 w-12 rounded bg-white/10" />
            </div>
          ))}
        </div>
        <div className="h-12 rounded-2xl bg-white/10" />
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
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
      <motion.div variants={itemVariants}>
        <p className="text-sm font-semibold text-white/70">오늘의 코디</p>
        <p className="text-lg font-bold text-white">
          {getTempLabel(recommendation.tempLevel)}
        </p>
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ClothingItemCard item={item} />
          </motion.div>
        ))}
      </motion.div>

      {/* 악세서리 */}
      {recommendation.accessories.length > 0 && (
        <motion.div variants={itemVariants}>
          <p className="mb-2 text-xs font-medium text-white/50">추천 악세서리</p>
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
