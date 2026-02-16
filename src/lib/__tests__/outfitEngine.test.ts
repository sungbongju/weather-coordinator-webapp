import {
  getTempLevel,
  getBaseOutfit,
  applyConditionModifiers,
  recommendOutfit,
} from '../outfitEngine';
import {
  mockWeatherFreezing,
  mockWeatherCold,
  mockWeatherChilly,
  mockWeatherMild,
  mockWeatherWarm,
  mockWeatherHot,
  mockWeatherScorching,
  mockWeatherRainyMild,
  mockWeatherWindyChilly,
  mockWeatherHighUV,
  mockWeatherLargeTempGap,
} from '@/__tests__/fixtures/weatherData';

describe('outfitEngine', () => {
  // === Step 1: getTempLevel ===
  describe('getTempLevel', () => {
    it('체감온도 -10°C → FREEZING', () => {
      expect(getTempLevel(-10)).toBe('FREEZING');
    });

    it('체감온도 -5°C → COLD (경계값)', () => {
      expect(getTempLevel(-5)).toBe('COLD');
    });

    it('체감온도 0°C → COLD', () => {
      expect(getTempLevel(0)).toBe('COLD');
    });

    it('체감온도 8°C → CHILLY', () => {
      expect(getTempLevel(8)).toBe('CHILLY');
    });

    it('체감온도 15°C → MILD', () => {
      expect(getTempLevel(15)).toBe('MILD');
    });

    it('체감온도 20°C → WARM', () => {
      expect(getTempLevel(20)).toBe('WARM');
    });

    it('체감온도 30°C → SCORCHING', () => {
      expect(getTempLevel(30)).toBe('SCORCHING');
    });
  });

  // === Step 2: getBaseOutfit ===
  describe('getBaseOutfit', () => {
    it('FREEZING → 아우터 + 상의 + 하의 + 신발 포함', () => {
      const outfit = getBaseOutfit('FREEZING');
      expect(outfit.outer).not.toBeNull();
      expect(outfit.outer?.category).toBe('OUTER');
      expect(outfit.top.category).toBe('TOP');
      expect(outfit.bottom.category).toBe('BOTTOM');
      expect(outfit.shoes.category).toBe('SHOES');
    });

    it('COLD → 아우터 포함', () => {
      const outfit = getBaseOutfit('COLD');
      expect(outfit.outer).not.toBeNull();
      expect(outfit.top.category).toBe('TOP');
    });

    it('CHILLY → 아우터 포함', () => {
      const outfit = getBaseOutfit('CHILLY');
      expect(outfit.outer).not.toBeNull();
    });

    it('MILD → 가벼운 아우터 또는 없음', () => {
      const outfit = getBaseOutfit('MILD');
      expect(outfit.top.category).toBe('TOP');
      expect(outfit.bottom.category).toBe('BOTTOM');
    });

    it('WARM → outer가 null일 수 있음', () => {
      const outfit = getBaseOutfit('WARM');
      expect(outfit.top.category).toBe('TOP');
      expect(outfit.bottom.category).toBe('BOTTOM');
    });

    it('HOT → 반팔/반바지 계열', () => {
      const outfit = getBaseOutfit('HOT');
      expect(outfit.top.category).toBe('TOP');
      expect(outfit.bottom.category).toBe('BOTTOM');
    });

    it('SCORCHING → 최소한의 옷차림', () => {
      const outfit = getBaseOutfit('SCORCHING');
      expect(outfit.outer).toBeNull();
      expect(outfit.top.category).toBe('TOP');
    });
  });

  // === Step 3: applyConditionModifiers ===
  describe('applyConditionModifiers', () => {
    it('강수확률 > 50% → 우산 추가', () => {
      const base = getBaseOutfit('MILD');
      const modified = applyConditionModifiers(base, mockWeatherRainyMild);

      expect(modified.modifiers.isRainy).toBe(true);
      const hasUmbrella = modified.accessories.some(
        (a) => a.id === 'acc-umbrella',
      );
      expect(hasUmbrella).toBe(true);
    });

    it('UV >= 6 → 선글라스 추가', () => {
      const base = getBaseOutfit('HOT');
      const modified = applyConditionModifiers(base, mockWeatherHighUV);

      expect(modified.modifiers.isHighUV).toBe(true);
      const hasSunglasses = modified.accessories.some(
        (a) => a.id === 'acc-sunglasses',
      );
      expect(hasSunglasses).toBe(true);
    });

    it('풍속 > 30km/h → 바람막이 권장', () => {
      const base = getBaseOutfit('CHILLY');
      const modified = applyConditionModifiers(base, mockWeatherWindyChilly);

      expect(modified.modifiers.isWindy).toBe(true);
    });

    it('일교차 >= 10°C → 레이어링', () => {
      const base = getBaseOutfit('WARM');
      const modified = applyConditionModifiers(base, mockWeatherLargeTempGap);

      expect(modified.modifiers.hasLargeTempGap).toBe(true);
      // 레이어링 시 아우터가 추가될 수 있음
      if (base.outer === null) {
        expect(modified.outer).not.toBeNull();
      }
    });

    it('여러 조건 동시 적용 (비 + UV)', () => {
      const rainyHighUV = {
        ...mockWeatherRainyMild,
        uvIndex: 8,
        feelsLike: 25,
      };
      const base = getBaseOutfit('HOT');
      const modified = applyConditionModifiers(base, rainyHighUV);

      expect(modified.modifiers.isRainy).toBe(true);
      expect(modified.modifiers.isHighUV).toBe(true);
    });
  });

  // === 선호도 반영 추천 ===
  describe('preference-aware recommendation', () => {
    it('싫어하는 아이템은 추천에서 제외된다', () => {
      const prefs = { dislikedItemIds: ['outer-long-puffer'], gender: null as 'M' | 'F' | null };
      const result = recommendOutfit(mockWeatherFreezing, prefs);
      expect(result.outer?.id).not.toBe('outer-long-puffer');
    });

    it('카테고리의 모든 아이템을 싫어하면 첫 번째로 fallback', () => {
      const allFreezingTopIds = ['top-heattech', 'top-knit', 'top-turtleneck'];
      const prefs = { dislikedItemIds: allFreezingTopIds, gender: null as 'M' | 'F' | null };
      const result = recommendOutfit(mockWeatherFreezing, prefs);
      expect(result.top).not.toBeNull();
    });

    it('극한 추위(-15°C) + 강풍 → 바람막이 대신 안전 오버라이드', () => {
      // 극한 추위 + 바람 → modifier가 바람막이로 교체 → safety override가 필수 방한 아이템 강제
      const extremeColdWindy = {
        ...mockWeatherFreezing,
        feelsLike: -15,
        windSpeed: 35, // 강풍으로 바람막이 교체 유도
      };
      const result = recommendOutfit(extremeColdWindy);
      expect(result.outer).not.toBeNull();
      expect(result.safetyOverride?.applied).toBe(true);
    });

    it('극한 추위가 아닐 때는 안전 오버라이드 없음', () => {
      const prefs = { dislikedItemIds: ['outer-jacket'], gender: null as 'M' | 'F' | null };
      const result = recommendOutfit(mockWeatherMild, prefs);
      expect(result.safetyOverride).toBeUndefined();
    });

    it('preferences 파라미터 없이도 동작 (하위 호환)', () => {
      const result = recommendOutfit(mockWeatherFreezing);
      expect(result.outer).not.toBeNull();
      expect(result.safetyOverride).toBeUndefined();
    });

    it('싫어하는 상의는 대안으로 교체된다', () => {
      const prefs = { dislikedItemIds: ['top-heattech'], gender: null as 'M' | 'F' | null };
      const result = recommendOutfit(mockWeatherFreezing, prefs);
      expect(result.top.id).not.toBe('top-heattech');
    });
  });

  // === Step 4: recommendOutfit 통합 ===
  describe('recommendOutfit', () => {
    it('추운 날씨 → 코트/패딩 계열 추천', () => {
      const result = recommendOutfit(mockWeatherFreezing);
      expect(result.tempLevel).toBe('FREEZING');
      expect(result.outer).not.toBeNull();
    });

    it('더운 맑은 날 → 가벼운 옷차림', () => {
      const result = recommendOutfit(mockWeatherHot);
      expect(result.tempLevel).toBe('HOT');
      expect(result.top.category).toBe('TOP');
    });

    it('결과에 comment가 포함되어야 한다', () => {
      const result = recommendOutfit(mockWeatherMild);
      expect(result.comment).toBeTruthy();
      expect(result.comment.length).toBeGreaterThan(0);
    });

    it('결과에 modifiers가 올바르게 설정되어야 한다', () => {
      const result = recommendOutfit(mockWeatherRainyMild);
      expect(result.modifiers).toBeDefined();
      expect(result.modifiers.isRainy).toBe(true);
    });
  });

  // === 성별 필터링 ===
  describe('gender filtering', () => {
    it("gender='M'이면 여성 전용 아이템이 추천되지 않는다", () => {
      const prefs = { dislikedItemIds: [], gender: 'M' as const };
      const result = recommendOutfit(mockWeatherScorching, prefs);
      // SCORCHING: top-crop(F)과 bottom-short-skirt(F)이 제외되어야 함
      expect(result.top.id).not.toBe('top-crop');
      expect(result.bottom.id).not.toBe('bottom-short-skirt');
    });

    it("gender='F'이면 여성 전용 아이템도 추천 가능하다", () => {
      const prefs = { dislikedItemIds: [], gender: 'F' as const };
      const result = recommendOutfit(mockWeatherScorching, prefs);
      // F + unisex 모두 가능
      expect(result.top).not.toBeNull();
      expect(result.bottom).not.toBeNull();
    });

    it('gender=null이면 성별 필터 없이 추천한다', () => {
      const prefs = { dislikedItemIds: [], gender: null };
      const result = recommendOutfit(mockWeatherScorching, prefs);
      expect(result.top).not.toBeNull();
    });

    it('gender + dislikedIds가 동시에 동작한다', () => {
      // HOT: top-short-tee(unisex), top-linen-shirt(unisex), top-polo(unisex)
      const prefs = { dislikedItemIds: ['top-short-tee'], gender: 'M' as const };
      const result = recommendOutfit(mockWeatherHot, prefs);
      expect(result.top.id).not.toBe('top-short-tee');
      expect(result.top.gender).not.toBe('F');
    });
  });
});
