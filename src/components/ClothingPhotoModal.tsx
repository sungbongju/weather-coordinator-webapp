'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { useClothingImages } from '@/hooks/useClothingImages';
import type { ClothingItem } from '@/types/outfit';
import { getCategoryIcon, getCategoryColor } from '@/lib/weatherMapping';

interface ClothingPhotoModalProps {
  item: ClothingItem | null;
  onClose: () => void;
}

function ImageSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[3/4] rounded-2xl skeleton-shimmer"
        />
      ))}
    </div>
  );
}

export function ClothingPhotoModal({ item, onClose }: ClothingPhotoModalProps) {
  const { images, isLoading, error } = useClothingImages(item?.name ?? null);

  // ESC 키로 닫기
  useEffect(() => {
    if (!item) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  // 스크롤 잠금
  useEffect(() => {
    if (!item) return;

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  const Icon = item ? getCategoryIcon(item.category) : null;
  const color = item ? getCategoryColor(item.category) : null;

  return (
    <AnimatePresence>
      {item && (
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
            className="relative z-10 flex flex-col max-h-screen mx-auto w-full max-w-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                {Icon && color && (
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color.bg} border ${color.border}`}>
                    <Icon size={20} className={color.iconColor} />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-white">{item.name}</h2>
                  <p className="text-xs text-white/50">{item.nameEn}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="닫기"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* 이미지 그리드 */}
            <div className="flex-1 overflow-y-auto px-4 pb-8 scrollbar-hide">
              {isLoading && <ImageSkeleton />}

              {error && (
                <div className="glass-card p-6 text-center">
                  <p className="text-sm text-white/70">{error}</p>
                </div>
              )}

              {!isLoading && !error && images.length === 0 && (
                <div className="glass-card p-6 text-center">
                  <p className="text-sm text-white/70">이미지를 찾을 수 없습니다.</p>
                </div>
              )}

              {!isLoading && images.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, i) => (
                    <motion.a
                      key={img.link}
                      href={img.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-white/5"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05, type: 'spring' as const, stiffness: 300, damping: 20 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <img
                        src={img.thumbnail}
                        alt={img.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <ExternalLink size={16} className="text-white/80" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
