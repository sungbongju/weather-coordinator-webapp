import type { WeatherData } from '@/types/weather';
import type {
  TempLevel,
  OutfitRecommendation,
  ConditionModifiers,
  ClothingItem,
  UserPreferences,
} from '@/types/outfit';
import { getItemsForTempLevel, getItemById, filterByGender } from './clothingData';
import { getRandomComment } from './comments';

// === Step 1: 체감온도 → 온도 레벨 분류 ===

interface TempThreshold {
  level: TempLevel;
  min: number;
  max: number;
}

const TEMP_THRESHOLDS: TempThreshold[] = [
  { level: 'FREEZING', min: -Infinity, max: -5 },
  { level: 'COLD', min: -5, max: 5 },
  { level: 'CHILLY', min: 5, max: 12 },
  { level: 'MILD', min: 12, max: 17 },
  { level: 'WARM', min: 17, max: 23 },
  { level: 'HOT', min: 23, max: 28 },
  { level: 'SCORCHING', min: 28, max: Infinity },
];

export function getTempLevel(feelsLikeTemp: number): TempLevel {
  for (const threshold of TEMP_THRESHOLDS) {
    if (feelsLikeTemp < threshold.max && feelsLikeTemp >= threshold.min) {
      return threshold.level;
    }
  }
  // 경계값: feelsLikeTemp === threshold.max인 경우 다음 레벨로
  return 'SCORCHING';
}

// === Step 2: 기본 코디 세트 선택 ===

function pickPreferred(items: ClothingItem[], dislikedIds: string[] = []): ClothingItem {
  if (items.length === 0) {
    throw new Error('No clothing items available');
  }
  const preferred = items.filter(item => !dislikedIds.includes(item.id));
  return preferred.length > 0 ? preferred[0]! : items[0]!;
}

export function getBaseOutfit(
  level: TempLevel,
  dislikedIds: string[] = [],
  gender: 'M' | 'F' | null = null,
): OutfitRecommendation {
  const outersRaw = getItemsForTempLevel(level, 'OUTER');
  const topsRaw = getItemsForTempLevel(level, 'TOP');
  const bottomsRaw = getItemsForTempLevel(level, 'BOTTOM');
  const shoesRaw = getItemsForTempLevel(level, 'SHOES');

  // 성별 필터 적용 (빈 결과 → fallback)
  const outers = filterByGender(outersRaw, gender).length > 0 ? filterByGender(outersRaw, gender) : outersRaw;
  const tops = filterByGender(topsRaw, gender).length > 0 ? filterByGender(topsRaw, gender) : topsRaw;
  const bottoms = filterByGender(bottomsRaw, gender).length > 0 ? filterByGender(bottomsRaw, gender) : bottomsRaw;
  const shoes = filterByGender(shoesRaw, gender).length > 0 ? filterByGender(shoesRaw, gender) : shoesRaw;

  // WARM 이상은 아우터 불필요
  const needsOuter = ['FREEZING', 'COLD', 'CHILLY', 'MILD'].includes(level);

  const defaultModifiers: ConditionModifiers = {
    isRainy: false,
    isSnowy: false,
    isHighUV: false,
    isWindy: false,
    hasLargeTempGap: false,
    isPoorAirQuality: false,
  };

  return {
    tempLevel: level,
    outer: needsOuter && outers.length > 0 ? pickPreferred(outers, dislikedIds) : null,
    top: pickPreferred(tops, dislikedIds),
    bottom: pickPreferred(bottoms, dislikedIds),
    shoes: pickPreferred(shoes, dislikedIds),
    accessories: [],
    comment: '',
    modifiers: defaultModifiers,
  };
}

// === Step 3: 추가 조건 레이어 적용 ===

export function applyConditionModifiers(
  outfit: OutfitRecommendation,
  weather: WeatherData,
): OutfitRecommendation {
  const result = {
    ...outfit,
    accessories: [...outfit.accessories],
    modifiers: { ...outfit.modifiers },
  };

  const tempGap = weather.tempMax - weather.tempMin;

  // 비/눈 (강수확률 > 50%)
  if (weather.precipitationProbability > 50) {
    result.modifiers.isRainy = true;
    const umbrella = getItemById('acc-umbrella');
    if (umbrella) result.accessories.push(umbrella);

    // 방수자켓으로 교체 고려
    if (weather.precipitationType === 'RAIN') {
      const rainJacket = getItemById('outer-rain-jacket');
      if (rainJacket) {
        result.outer = rainJacket;
      }
    }

    if (weather.precipitationType === 'SNOW') {
      result.modifiers.isSnowy = true;
    }
  }

  // UV 높음 (UV지수 >= 6)
  if (weather.uvIndex >= 6) {
    result.modifiers.isHighUV = true;
    const sunglasses = getItemById('acc-sunglasses');
    const cap = getItemById('acc-cap');
    const sunscreen = getItemById('acc-sunscreen');
    if (sunglasses) result.accessories.push(sunglasses);
    if (cap) result.accessories.push(cap);
    if (sunscreen) result.accessories.push(sunscreen);
  }

  // 바람 강함 (풍속 > 30km/h)
  if (weather.windSpeed > 30) {
    result.modifiers.isWindy = true;
    const windbreaker = getItemById('outer-windbreaker');
    if (windbreaker && result.outer?.id !== 'outer-rain-jacket') {
      result.outer = windbreaker;
    }
  }

  // 일교차 큼 (최고-최저 >= 10°C)
  if (tempGap >= 10) {
    result.modifiers.hasLargeTempGap = true;
    // 아우터가 없는 경우 가디건/바람막이 추가
    if (!result.outer) {
      const cardigan = getItemById('outer-cardigan');
      const windbreaker = getItemById('outer-windbreaker');
      result.outer = cardigan ?? windbreaker ?? null;
    }
  }

  return result;
}

// === Step 4: 극한 날씨 안전 오버라이드 ===

const EXTREME_COLD_THRESHOLD = -10; // °C feelsLike

const EXTREME_COLD_ESSENTIAL_IDS = [
  'outer-long-puffer',
  'outer-short-puffer',
  'outer-long-coat',
  'outer-coat',
];

function applySafetyOverride(
  outfit: OutfitRecommendation,
  weather: WeatherData,
  dislikedIds: string[],
): OutfitRecommendation {
  if (weather.feelsLike > EXTREME_COLD_THRESHOLD) return outfit;

  // 현재 아우터가 이미 필수 방한 아이템이면 통과
  if (outfit.outer && EXTREME_COLD_ESSENTIAL_IDS.includes(outfit.outer.id)) {
    return outfit;
  }

  // 필수 방한 아이템 중 하나를 강제 선택
  const essentialItems = EXTREME_COLD_ESSENTIAL_IDS
    .map(id => getItemById(id))
    .filter((item): item is ClothingItem => item !== undefined);

  // 싫어하지 않는 것 우선, 없으면 첫 번째
  const preferred = essentialItems.filter(i => !dislikedIds.includes(i.id));
  const overrideItem = preferred[0] ?? essentialItems[0];

  if (overrideItem) {
    return {
      ...outfit,
      outer: overrideItem,
      safetyOverride: {
        applied: true,
        reason: `체감온도 ${Math.round(weather.feelsLike)}°C — 안전을 위해 ${overrideItem.name} 추천`,
        overriddenItemId: overrideItem.id,
      },
    };
  }

  return outfit;
}

// === Step 5: 전체 파이프라인 ===

export function recommendOutfit(
  weather: WeatherData,
  preferences?: UserPreferences,
): OutfitRecommendation {
  const dislikedIds = preferences?.dislikedItemIds ?? [];
  const gender = preferences?.gender ?? null;
  const tempLevel = getTempLevel(weather.feelsLike);
  const baseOutfit = getBaseOutfit(tempLevel, dislikedIds, gender);
  const modified = applyConditionModifiers(baseOutfit, weather);
  const safe = applySafetyOverride(modified, weather, dislikedIds);
  safe.comment = getRandomComment(tempLevel);
  return safe;
}
