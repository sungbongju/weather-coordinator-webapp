import type { WeatherConditionType } from '@/types/weather';
import type { TempLevel, Category, ConditionModifiers } from '@/types/outfit';

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

/** 의류 카테고리 → 이모지 */
const CATEGORY_EMOJIS: Record<Category, string> = {
  OUTER: '🧥',
  TOP: '👕',
  BOTTOM: '👖',
  SHOES: '👟',
  ACCESSORY: '🎒',
};

export function getCategoryEmoji(category: Category): string {
  return CATEGORY_EMOJIS[category];
}

/** 조건 배지 타입 */
export interface ModifierBadge {
  icon: string;
  label: string;
  color: string;
}

/** 조건 수정자 → 배지 배열 */
export function getModifierBadges(modifiers: ConditionModifiers): ModifierBadge[] {
  const badges: ModifierBadge[] = [];

  if (modifiers.isRainy) {
    badges.push({ icon: '🌧️', label: '비', color: 'text-blue-400' });
  }
  if (modifiers.isSnowy) {
    badges.push({ icon: '❄️', label: '눈', color: 'text-sky-300' });
  }
  if (modifiers.isHighUV) {
    badges.push({ icon: '☀️', label: '자외선', color: 'text-amber-400' });
  }
  if (modifiers.isWindy) {
    badges.push({ icon: '💨', label: '강풍', color: 'text-teal-400' });
  }
  if (modifiers.hasLargeTempGap) {
    badges.push({ icon: '🌡️', label: '일교차', color: 'text-orange-400' });
  }
  if (modifiers.isPoorAirQuality) {
    badges.push({ icon: '😷', label: '미세먼지', color: 'text-gray-400' });
  }

  return badges;
}
