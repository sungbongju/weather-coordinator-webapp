import type { ConditionModifiers } from '@/types/outfit';
import { getModifierBadges } from '@/lib/weatherMapping';

interface ConditionBadgesProps {
  modifiers: ConditionModifiers;
}

export function ConditionBadges({ modifiers }: ConditionBadgesProps) {
  const badges = getModifierBadges(modifiers);

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge.label}
          className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm border border-white/10"
        >
          <span>{badge.icon}</span>
          <span>{badge.label}</span>
        </span>
      ))}
    </div>
  );
}
