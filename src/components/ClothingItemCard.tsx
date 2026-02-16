'use client';

import type { ClothingItem, Category } from '@/types/outfit';
import { getCategoryIcon, getCategoryColor } from '@/lib/weatherMapping';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

interface ClothingItemCardProps {
  item: ClothingItem | null;
  className?: string;
  onClick?: () => void;
}

const CATEGORY_LABELS: Record<Category, string> = {
  OUTER: '아우터',
  TOP: '상의',
  BOTTOM: '하의',
  SHOES: '신발',
  ACCESSORY: '액세서리',
};

export function ClothingItemCard({ item, className, onClick }: ClothingItemCardProps) {
  if (!item) return null;

  const Icon = getCategoryIcon(item.category);
  const color = getCategoryColor(item.category);

  return (
    <motion.div
      className={cn('flex flex-col items-center gap-2', onClick && 'cursor-pointer', className)}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        className={cn(
          'flex h-24 w-24 items-center justify-center rounded-3xl',
          'bg-gradient-to-br backdrop-blur-sm border shadow-glass-sm',
          'category-card-glow transition-all',
          color.bg,
          color.border,
        )}
      >
        <Icon size={36} strokeWidth={1.5} className={color.iconColor} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-white">{item.name}</p>
        <p className="text-xs text-white/50">{CATEGORY_LABELS[item.category]}</p>
      </div>
    </motion.div>
  );
}
