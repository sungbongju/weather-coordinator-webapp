import type { ClothingItem, Category } from '@/types/outfit';
import { getCategoryEmoji } from '@/lib/weatherMapping';
import { cn } from '@/lib/cn';

interface ClothingItemCardProps {
  item: ClothingItem | null;
  className?: string;
}

const CATEGORY_LABELS: Record<Category, string> = {
  OUTER: '아우터',
  TOP: '상의',
  BOTTOM: '하의',
  SHOES: '신발',
  ACCESSORY: '액세서리',
};

export function ClothingItemCard({ item, className }: ClothingItemCardProps) {
  if (!item) return null;

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-glass-sm transition-transform hover:scale-105">
        <span className="text-3xl">{getCategoryEmoji(item.category)}</span>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-white">{item.name}</p>
        <p className="text-xs text-white/50">{CATEGORY_LABELS[item.category]}</p>
      </div>
    </div>
  );
}
