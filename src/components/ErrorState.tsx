'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      className="glass-card p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
    >
      <motion.div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <AlertTriangle size={28} className="text-red-300" />
      </motion.div>
      <p className="mt-4 text-sm font-medium text-white/80">{message}</p>
      <motion.button
        onClick={onRetry}
        className="glass-button mt-4 inline-flex items-center gap-2 text-sm text-white"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RefreshCw size={14} />
        다시 시도
      </motion.button>
    </motion.div>
  );
}
