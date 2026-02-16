// 코디 추천 관련 타입 정의

/** 의류 카테고리 */
export type Category = 'OUTER' | 'TOP' | 'BOTTOM' | 'SHOES' | 'ACCESSORY';

/** 온도 레벨 (7단계) */
export type TempLevel =
  | 'FREEZING'    // ~ -5°C
  | 'COLD'        // -5 ~ 5°C
  | 'CHILLY'      // 5 ~ 12°C
  | 'MILD'        // 12 ~ 17°C
  | 'WARM'        // 17 ~ 23°C
  | 'HOT'         // 23 ~ 28°C
  | 'SCORCHING';  // 28°C ~

/** 모든 TempLevel 값 배열 (런타임 검증용) */
export const TEMP_LEVELS: TempLevel[] = [
  'FREEZING', 'COLD', 'CHILLY', 'MILD', 'WARM', 'HOT', 'SCORCHING',
];

/** 모든 Category 값 배열 (런타임 검증용) */
export const CATEGORIES: Category[] = [
  'OUTER', 'TOP', 'BOTTOM', 'SHOES', 'ACCESSORY',
];

/** 개별 의류 아이템 */
export interface ClothingItem {
  id: string;
  name: string;                     // 한글 이름 "패딩"
  nameEn: string;                   // 영문 이름 "Puffer Jacket"
  category: Category;
  imageUrl: string;                 // "/assets/clothing/outer/puffer.webp"
  tempLevels: TempLevel[];          // 이 옷이 적합한 온도 레벨들
  tags: string[];                   // ["방한", "캐주얼"]
}

/** 조건 수정자 — 어떤 특수 조건이 적용되었는지 */
export interface ConditionModifiers {
  isRainy: boolean;                 // 강수확률 > 50%
  isSnowy: boolean;                 // 강수타입 SNOW
  isHighUV: boolean;                // UV >= 6
  isWindy: boolean;                 // 풍속 > 30 km/h
  hasLargeTempGap: boolean;         // 일교차 >= 10°C
  isPoorAirQuality: boolean;        // AQI > 100 (추후)
}

/** 코디 추천 결과 */
export interface OutfitRecommendation {
  tempLevel: TempLevel;
  outer: ClothingItem | null;       // WARM 이상이면 null일 수 있음
  top: ClothingItem;
  bottom: ClothingItem;
  shoes: ClothingItem;
  accessories: ClothingItem[];
  comment: string;                  // 한 줄 코멘트
  modifiers: ConditionModifiers;    // 적용된 조건들
  safetyOverride?: SafetyOverride;  // 극한 날씨 안전 오버라이드
}

/** 사용자 의류 선호도 */
export interface UserPreferences {
  dislikedItemIds: string[];
}

/** 안전 오버라이드 (극한 날씨에서 선호도 무시) */
export interface SafetyOverride {
  applied: boolean;
  reason: string;
  overriddenItemId: string;
}

/** 코멘트 템플릿 구조 */
export type CommentTemplates = Record<TempLevel, string[]>;
