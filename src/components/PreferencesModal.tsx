'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, ThumbsDown } from 'lucide-react';
import { getItemsByCategory, filterByGender } from '@/lib/clothingData';
import { getCategoryIcon, getCategoryColor } from '@/lib/weatherMapping';
import { usePreferenceStore } from '@/store/preferenceStore';
import { cn } from '@/lib/cn';
import type { Category, ClothingItem } from '@/types/outfit';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'OUTER', label: '아우터' },
  { key: 'TOP', label: '상의' },
  { key: 'BOTTOM', label: '하의' },
  { key: 'SHOES', label: '신발' },
];

function CategorySection({ category, label }: { category: Category; label: string }) {
  const toggleDislike = usePreferenceStore((s) => s.toggleDislike);
  const isDisliked = usePreferenceStore((s) => s.isDisliked);
  const gender = usePreferenceStore((s) => s.preferences.gender);
  const items = filterByGender(getItemsByCategory(category), gender);
  const Icon = getCategoryIcon(category);
  const color = getCategoryColor(category);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon size={16} className={color.iconColor} />
        <h3 className="text-sm font-semibold text-white">{label}</h3>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <PreferenceItem
            key={item.id}
            item={item}
            isDisliked={isDisliked(item.id)}
            onToggle={() => toggleDislike(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PreferenceItem({
  item,
  isDisliked,
  onToggle,
}: {
  item: ClothingItem;
  isDisliked: boolean;
  onToggle: () => void;
}) {
  const color = getCategoryColor(item.category);

  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left',
        'border backdrop-blur-sm',
        isDisliked
          ? 'bg-red-500/10 border-red-400/30 opacity-60'
          : 'bg-white/5 border-white/10 hover:bg-white/10',
      )}
    >
      <span className="text-sm text-white truncate">{item.name}</span>
      {isDisliked && (
        <ThumbsDown size={12} className="text-red-400 shrink-0 ml-auto" />
      )}
    </button>
  );
}

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const clearAllDislikes = usePreferenceStore((s) => s.clearAllDislikes);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            data-testid="modal-backdrop"
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            className="relative z-10 flex flex-col max-h-screen mx-auto w-full max-w-lg px-4 pt-12 pb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">옷장 설정</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearAllDislikes}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs font-medium text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <RotateCcw size={12} />
                  <span>초기화</span>
                </button>
                <button
                  onClick={onClose}
                  aria-label="닫기"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* 안내 문구 */}
            <div className="glass-card px-4 py-3 mb-4">
              <p className="text-xs text-white/60">
                싫어하는 아이템을 탭하면 추천에서 제외됩니다. 다시 탭하면 복원됩니다.
              </p>
            </div>

            {/* 카테고리별 아이템 목록 */}
            <div className="flex-1 overflow-y-auto space-y-5 scrollbar-hide">
              {CATEGORIES.map(({ key, label }) => (
                <CategorySection key={key} category={key} label={label} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
