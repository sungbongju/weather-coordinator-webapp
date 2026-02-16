import { describe, it, expect } from 'vitest';
import {
  getWeatherBackground,
  getTempBackground,
  getTempLabel,
  getCategoryIcon,
  getCategoryColor,
  getModifierBadges,
} from '../weatherMapping';
import type { ConditionModifiers } from '@/types/outfit';

describe('weatherMapping', () => {
  describe('getWeatherBackground', () => {
    it('맑은 낮 → bg-weather-sunny', () => {
      expect(getWeatherBackground('CLEAR', true)).toBe('bg-weather-sunny');
    });

    it('구름 조금 낮 → bg-weather-partly-cloudy', () => {
      expect(getWeatherBackground('PARTLY_CLOUDY', true)).toBe('bg-weather-partly-cloudy');
    });

    it('비 → bg-weather-rainy', () => {
      expect(getWeatherBackground('RAIN', true)).toBe('bg-weather-rainy');
    });

    it('눈 → bg-weather-snowy', () => {
      expect(getWeatherBackground('SNOW', true)).toBe('bg-weather-snowy');
    });

    it('천둥 → bg-weather-thunder', () => {
      expect(getWeatherBackground('THUNDERSTORM', true)).toBe('bg-weather-thunder');
    });

    it('안개 → bg-weather-foggy', () => {
      expect(getWeatherBackground('FOGGY', true)).toBe('bg-weather-foggy');
    });

    it('맑은 밤 → bg-weather-night-clear', () => {
      expect(getWeatherBackground('CLEAR', false)).toBe('bg-weather-night-clear');
    });

    it('흐린 밤 → bg-weather-night-cloudy', () => {
      expect(getWeatherBackground('CLOUDY', false)).toBe('bg-weather-night-cloudy');
    });
  });

  describe('getTempBackground', () => {
    it.each([
      ['FREEZING', 'bg-temp-freezing'],
      ['COLD', 'bg-temp-cold'],
      ['CHILLY', 'bg-temp-chilly'],
      ['MILD', 'bg-temp-mild'],
      ['WARM', 'bg-temp-warm'],
      ['HOT', 'bg-temp-hot'],
      ['SCORCHING', 'bg-temp-scorching'],
    ] as const)('%s → %s', (level, expected) => {
      expect(getTempBackground(level)).toBe(expected);
    });
  });

  describe('getTempLabel', () => {
    it('FREEZING → 한파주의', () => {
      expect(getTempLabel('FREEZING')).toBe('한파주의');
    });

    it('COLD → 매우 추움', () => {
      expect(getTempLabel('COLD')).toBe('매우 추움');
    });

    it('CHILLY → 쌀쌀함', () => {
      expect(getTempLabel('CHILLY')).toBe('쌀쌀함');
    });

    it('MILD → 선선함', () => {
      expect(getTempLabel('MILD')).toBe('선선함');
    });

    it('WARM → 따뜻함', () => {
      expect(getTempLabel('WARM')).toBe('따뜻함');
    });

    it('HOT → 더움', () => {
      expect(getTempLabel('HOT')).toBe('더움');
    });

    it('SCORCHING → 폭염주의', () => {
      expect(getTempLabel('SCORCHING')).toBe('폭염주의');
    });
  });

  describe('getCategoryIcon', () => {
    it('각 카테고리에 대해 아이콘 컴포넌트를 반환한다', () => {
      expect(getCategoryIcon('OUTER')).toBeDefined();
      expect(getCategoryIcon('TOP')).toBeDefined();
      expect(getCategoryIcon('BOTTOM')).toBeDefined();
      expect(getCategoryIcon('SHOES')).toBeDefined();
      expect(getCategoryIcon('ACCESSORY')).toBeDefined();
    });

    it('서로 다른 카테고리는 다른 아이콘을 반환한다', () => {
      const outer = getCategoryIcon('OUTER');
      const top = getCategoryIcon('TOP');
      expect(outer).not.toBe(top);
    });
  });

  describe('getCategoryColor', () => {
    it('OUTER → indigo 계열 색상', () => {
      const color = getCategoryColor('OUTER');
      expect(color.bg).toContain('indigo');
      expect(color.border).toContain('indigo');
      expect(color.iconColor).toContain('indigo');
    });

    it('TOP → sky 계열 색상', () => {
      const color = getCategoryColor('TOP');
      expect(color.bg).toContain('sky');
      expect(color.iconColor).toContain('sky');
    });

    it('BOTTOM → emerald 계열 색상', () => {
      const color = getCategoryColor('BOTTOM');
      expect(color.bg).toContain('emerald');
    });

    it('SHOES → amber 계열 색상', () => {
      const color = getCategoryColor('SHOES');
      expect(color.bg).toContain('amber');
    });

    it('ACCESSORY → pink 계열 색상', () => {
      const color = getCategoryColor('ACCESSORY');
      expect(color.bg).toContain('pink');
    });
  });

  describe('getModifierBadges', () => {
    const noModifiers: ConditionModifiers = {
      isRainy: false,
      isSnowy: false,
      isHighUV: false,
      isWindy: false,
      hasLargeTempGap: false,
      isPoorAirQuality: false,
    };

    it('조건 없으면 빈 배열', () => {
      expect(getModifierBadges(noModifiers)).toEqual([]);
    });

    it('비 올 때 비 배지 (IconComponent + colorClass)', () => {
      const badges = getModifierBadges({ ...noModifiers, isRainy: true });
      expect(badges).toHaveLength(1);
      expect(badges[0]?.label).toBe('비');
      expect(badges[0]?.IconComponent).toBeDefined();
      expect(badges[0]?.colorClass).toContain('blue');
    });

    it('눈 올 때 눈 배지', () => {
      const badges = getModifierBadges({ ...noModifiers, isSnowy: true });
      expect(badges).toHaveLength(1);
      expect(badges[0]?.label).toBe('눈');
      expect(badges[0]?.colorClass).toContain('sky');
    });

    it('복합 조건 → 여러 배지', () => {
      const badges = getModifierBadges({
        ...noModifiers,
        isRainy: true,
        isHighUV: true,
        isWindy: true,
      });
      expect(badges).toHaveLength(3);
      expect(badges.map((b) => b.label)).toContain('비');
      expect(badges.map((b) => b.label)).toContain('자외선');
      expect(badges.map((b) => b.label)).toContain('강풍');
    });

    it('일교차 큼 배지', () => {
      const badges = getModifierBadges({ ...noModifiers, hasLargeTempGap: true });
      expect(badges).toHaveLength(1);
      expect(badges[0]?.label).toBe('일교차');
      expect(badges[0]?.colorClass).toContain('orange');
    });
  });
});
