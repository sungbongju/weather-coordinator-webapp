import {
  CLOTHING_ITEMS,
  getItemsByCategory,
  getItemsForTempLevel,
  getItemById,
} from '../clothingData';
import { CATEGORIES, TEMP_LEVELS } from '@/types/outfit';
import type { Category, TempLevel } from '@/types/outfit';

describe('clothingData', () => {
  it('모든 의류 아이템에 고유 id가 있어야 한다', () => {
    const ids = CLOTHING_ITEMS.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('모든 카테고리에 최소 1개 이상의 아이템이 있어야 한다', () => {
    for (const category of CATEGORIES) {
      const items = getItemsByCategory(category);
      expect(items.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('OUTER 카테고리에 11개 아이템이 있어야 한다', () => {
    expect(getItemsByCategory('OUTER')).toHaveLength(11);
  });

  it('TOP 카테고리에 12개 아이템이 있어야 한다', () => {
    expect(getItemsByCategory('TOP')).toHaveLength(12);
  });

  it('BOTTOM 카테고리에 9개 아이템이 있어야 한다', () => {
    expect(getItemsByCategory('BOTTOM')).toHaveLength(9);
  });

  it('SHOES 카테고리에 7개 아이템이 있어야 한다', () => {
    expect(getItemsByCategory('SHOES')).toHaveLength(7);
  });

  it('ACCESSORY 카테고리에 10개 아이템이 있어야 한다', () => {
    expect(getItemsByCategory('ACCESSORY')).toHaveLength(10);
  });

  it('모든 아이템이 유효한 tempLevels를 가져야 한다', () => {
    for (const item of CLOTHING_ITEMS) {
      expect(item.tempLevels.length).toBeGreaterThanOrEqual(1);
      for (const level of item.tempLevels) {
        expect(TEMP_LEVELS).toContain(level);
      }
    }
  });

  it('getItemsByCategory가 올바른 카테고리의 아이템만 반환해야 한다', () => {
    const outerItems = getItemsByCategory('OUTER');
    for (const item of outerItems) {
      expect(item.category).toBe('OUTER');
    }
  });

  it('getItemsForTempLevel이 해당 온도 레벨에 맞는 아이템만 반환해야 한다', () => {
    const freezingOuters = getItemsForTempLevel('FREEZING', 'OUTER');
    for (const item of freezingOuters) {
      expect(item.tempLevels).toContain('FREEZING');
      expect(item.category).toBe('OUTER');
    }
    expect(freezingOuters.length).toBeGreaterThanOrEqual(1);
  });
});
