'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface OutfitCommentProps {
  comment: string;
}

export function OutfitComment({ comment }: OutfitCommentProps) {
  if (!comment) return null;

  return (
    <motion.div
      className="gradient-border-accent glass-light rounded-2xl px-5 py-4 shadow-glass-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
          <MessageCircle size={16} className="text-secondary" />
        </div>
        <p className="text-sm font-medium leading-relaxed text-white/90 pt-1">
          {comment}
        </p>
      </div>
    </motion.div>
  );
}
