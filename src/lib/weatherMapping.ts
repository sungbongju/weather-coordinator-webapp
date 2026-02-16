import type { WeatherConditionType } from '@/types/weather';
import type { TempLevel, Category, ConditionModifiers } from '@/types/outfit';
import type { LucideIcon } from 'lucide-react';
import {
  ShieldHalf,
  Shirt,
  RectangleVertical,
  Footprints,
  Gem,
  CloudRain,
  Snowflake,
  Sun,
  Wind,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';

/** 날씨 조건 + 주간/야간 → 배경 CSS 클래스 */
export function getWeatherBackground(
  condition: WeatherConditionType,
  isDaytime: boolean,
): string {
  if (!isDaytime) {
    const clearNight: WeatherConditionType[] = ['CLEAR', 'MOSTLY_CLEAR'];
    return clearNight.includes(condition)
      ? 'bg-weather-night-clear'
      : 'bg-weather-night-cloudy';
  }

  const conditionMap: Partial<Record<WeatherConditionType, string>> = {
    CLEAR: 'bg-weather-sunny',
    MOSTLY_CLEAR: 'bg-weather-sunny',
    PARTLY_CLOUDY: 'bg-weather-partly-cloudy',
    MOSTLY_CLOUDY: 'bg-weather-cloudy',
    CLOUDY: 'bg-weather-cloudy',
    LIGHT_RAIN: 'bg-weather-rainy',
    RAIN: 'bg-weather-rainy',
    HEAVY_RAIN: 'bg-weather-rainy',
    LIGHT_SNOW: 'bg-weather-snowy',
    SNOW: 'bg-weather-snowy',
    HEAVY_SNOW: 'bg-weather-snowy',
    THUNDERSTORM: 'bg-weather-thunder',
    FOGGY: 'bg-weather-foggy',
    WINDY: 'bg-weather-partly-cloudy',
  };

  return conditionMap[condition] ?? 'bg-weather-default';
}

/** 온도 레벨 → 배경 CSS 클래스 */
export function getTempBackground(level: TempLevel): string {
  return `bg-temp-${level.toLowerCase()}`;
}

/** 온도 레벨 → 한글 라벨 */
const TEMP_LABELS: Record<TempLevel, string> = {
  FREEZING: '한파주의',
  COLD: '매우 추움',
  CHILLY: '쌀쌀함',
  MILD: '선선함',
  WARM: '따뜻함',
  HOT: '더움',
  SCORCHING: '폭염주의',
};

export function getTempLabel(level: TempLevel): string {
  return TEMP_LABELS[level];
}

/** 의류 카테고리 → Lucide 아이콘 컴포넌트 */
const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  OUTER: ShieldHalf,
  TOP: Shirt,
  BOTTOM: RectangleVertical,
  SHOES: Footprints,
  ACCESSORY: Gem,
};

export function getCategoryIcon(category: Category): LucideIcon {
  return CATEGORY_ICONS[category];
}

/** 카테고리별 그라디언트 색상 */
export interface CategoryColor {
  bg: string;
  border: string;
  iconColor: string;
}

const CATEGORY_COLORS: Record<Category, CategoryColor> = {
  OUTER: { bg: 'from-indigo-500/20 to-purple-500/20', border: 'border-indigo-300/30', iconColor: 'text-indigo-200' },
  TOP: { bg: 'from-sky-500/20 to-cyan-500/20', border: 'border-sky-300/30', iconColor: 'text-sky-200' },
  BOTTOM: { bg: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-300/30', iconColor: 'text-emerald-200' },
  SHOES: { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-300/30', iconColor: 'text-amber-200' },
  ACCESSORY: { bg: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-300/30', iconColor: 'text-pink-200' },
};

export function getCategoryColor(category: Category): CategoryColor {
  return CATEGORY_COLORS[category];
}

/** 조건 배지 타입 */
export interface ModifierBadge {
  IconComponent: LucideIcon;
  label: string;
  colorClass: string;
}

/** 조건 수정자 → 배지 배열 */
export function getModifierBadges(modifiers: ConditionModifiers): ModifierBadge[] {
  const badges: ModifierBadge[] = [];

  if (modifiers.isRainy) {
    badges.push({ IconComponent: CloudRain, label: '비', colorClass: 'bg-blue-500/20 text-blue-200 border-blue-400/30' });
  }
  if (modifiers.isSnowy) {
    badges.push({ IconComponent: Snowflake, label: '눈', colorClass: 'bg-sky-500/20 text-sky-200 border-sky-400/30' });
  }
  if (modifiers.isHighUV) {
    badges.push({ IconComponent: Sun, label: '자외선', colorClass: 'bg-amber-500/20 text-amber-200 border-amber-400/30' });
  }
  if (modifiers.isWindy) {
    badges.push({ IconComponent: Wind, label: '강풍', colorClass: 'bg-teal-500/20 text-teal-200 border-teal-400/30' });
  }
  if (modifiers.hasLargeTempGap) {
    badges.push({ IconComponent: Thermometer, label: '일교차', colorClass: 'bg-orange-500/20 text-orange-200 border-orange-400/30' });
  }
  if (modifiers.isPoorAirQuality) {
    badges.push({ IconComponent: ShieldAlert, label: '미세먼지', colorClass: 'bg-gray-500/20 text-gray-200 border-gray-400/30' });
  }

  return badges;
}
