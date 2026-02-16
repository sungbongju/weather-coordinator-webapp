'use client';

import { usePreferenceStore } from '@/store/preferenceStore';
import { cn } from '@/lib/cn';

export function GenderToggle() {
  const gender = usePreferenceStore((s) => s.preferences.gender);
  const setGender = usePreferenceStore((s) => s.setGender);

  const handleToggle = (value: 'M' | 'F') => {
    setGender(gender === value ? null : value);
  };

  return (
    <div
      className="flex items-center gap-1 rounded-full bg-white/10 p-1"
      role="radiogroup"
      aria-label="성별 선호도"
      data-testid="gender-toggle"
    >
      <button
        onClick={() => handleToggle('M')}
        role="radio"
        aria-checked={gender === 'M'}
        data-testid="gender-toggle-M"
        className={cn(
          'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
          gender === 'M'
            ? 'bg-[var(--color-primary)] text-white shadow-sm'
            : 'text-white/60 hover:text-white/80',
        )}
      >
        남성
      </button>
      <button
        onClick={() => handleToggle('F')}
        role="radio"
        aria-checked={gender === 'F'}
        data-testid="gender-toggle-F"
        className={cn(
          'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
          gender === 'F'
            ? 'bg-[var(--color-secondary)] text-white shadow-sm'
            : 'text-white/60 hover:text-white/80',
        )}
      >
        여성
      </button>
    </div>
  );
}
