'use client';

import type { ConditionModifiers } from '@/types/outfit';
import { getModifierBadges } from '@/lib/weatherMapping';
import { motion } from 'framer-motion';

interface ConditionBadgesProps {
  modifiers: ConditionModifiers;
}

export function ConditionBadges({ modifiers }: ConditionBadgesProps) {
  const badges = getModifierBadges(modifiers);

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, i) => (
        <motion.span
          key={badge.label}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm border ${badge.colorClass}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring' as const,
            stiffness: 500,
            damping: 25,
            delay: i * 0.08,
          }}
          whileHover={{ scale: 1.1 }}
        >
          <badge.IconComponent size={14} />
          <span>{badge.label}</span>
        </motion.span>
      ))}
    </div>
  );
}
