import type { ClothingItem, Category, TempLevel } from '@/types/outfit';

// === 아우터 (OUTER) — 8종 ===
const outerItems: ClothingItem[] = [
  {
    id: 'outer-long-puffer',
    name: '롱패딩',
    nameEn: 'Long Puffer',
    category: 'OUTER',
    imageUrl: '/assets/clothing/outer/long-puffer.webp',
    tempLevels: ['FREEZING'],
    tags: ['방한', '겨울', '캐주얼'],
  },
  {
    id: 'outer-short-puffer',
    name: '숏패딩',
    nameEn: 'Short Puffer',
    category: 'OUTER',
    imageUrl: '/assets/clothing/outer/short-puffer.webp',
    tempLevels: ['FREEZING', 'COLD'],
    tags: ['방한', '겨울'],
  },
  {
    id: 'outer-coat',
    name: '코트',
    nameEn: 'Coat',
    category: 'OUTER',
    imageUrl: '/assets/clothing/outer/coat.webp',
    tempLevels: ['COLD'],
    tags: ['포멀', '겨울'],
  },
  {
    id: 'outer-trench',
    name: '트렌치코트',
    nameEn: 'Trench Coat',
    category: 'OUTER',
    imageUrl: '/assets/clothing/outer/trench.webp',
    tempLevels: ['CHILLY'],
    tags: ['클래식', '봄가을'],
  },
  {
    id: 'outer-jacket',
    name: '자켓',
    nameEn: 'Jacket',
    category: 'OUTER',
    imageUrl: '/assets/clothing/outer/jacket.webp',
    tempLevels: ['CHILLY', 'MILD'],
    tags: ['캐주얼', '봄가을'],
  },
  {
    id: 'outer-cardigan',
    name: '가디건',
    nameEn: 'Cardigan',
    category: 'OUTER',
    imageUrl: '/assets/clothing/outer/cardigan.webp',
    tempLevels: ['MILD'],
    tags: ['캐주얼', '레이어링'],
  },
  {
    id: 'outer-windbreaker',
    name: '바람막이',
    nameEn: 'Windbreaker',
    category: 'OUTER',
    imageUrl: '/assets/clothing/outer/windbreaker.webp',
    tempLevels: ['CHILLY', 'MILD', 'WARM'],
    tags: ['스포티', '바람'],
  },
  {
    id: 'outer-rain-jacket',
    name: '방수자켓',
    nameEn: 'Rain Jacket',
    category: 'OUTER',
    imageUrl: '/assets/clothing/outer/rain-jacket.webp',
    tempLevels: ['CHILLY', 'MILD', 'WARM', 'COLD'],
    tags: ['비', '방수'],
  },
];

// === 상의 (TOP) — 10종 ===
const topItems: ClothingItem[] = [
  {
    id: 'top-heattech',
    name: '히트텍',
    nameEn: 'Heattech',
    category: 'TOP',
    imageUrl: '/assets/clothing/top/heattech.webp',
    tempLevels: ['FREEZING'],
    tags: ['이너', '방한'],
  },
  {
    id: 'top-knit',
    name: '니트/스웨터',
    nameEn: 'Knit Sweater',
    category: 'TOP',
    imageUrl: '/assets/clothing/top/knit.webp',
    tempLevels: ['FREEZING', 'COLD'],
    tags: ['따뜻', '캐주얼'],
  },
  {
    id: 'top-sweatshirt',
    name: '맨투맨/후드',
    nameEn: 'Sweatshirt',
    category: 'TOP',
    imageUrl: '/assets/clothing/top/sweatshirt.webp',
    tempLevels: ['COLD', 'CHILLY'],
    tags: ['캐주얼', '스포티'],
  },
  {
    id: 'top-long-shirt',
    name: '긴팔 셔츠',
    nameEn: 'Long Sleeve Shirt',
    category: 'TOP',
    imageUrl: '/assets/clothing/top/long-shirt.webp',
    tempLevels: ['CHILLY', 'MILD'],
    tags: ['포멀', '깔끔'],
  },
  {
    id: 'top-long-tee',
    name: '긴팔 티셔츠',
    nameEn: 'Long Sleeve Tee',
    category: 'TOP',
    imageUrl: '/assets/clothing/top/long-tee.webp',
    tempLevels: ['MILD', 'WARM'],
    tags: ['캐주얼', '기본'],
  },
  {
    id: 'top-short-tee',
    name: '반팔 티셔츠',
    nameEn: 'Short Sleeve Tee',
    category: 'TOP',
    imageUrl: '/assets/clothing/top/short-tee.webp',
    tempLevels: ['WARM', 'HOT'],
    tags: ['캐주얼', '여름'],
  },
  {
    id: 'top-linen-shirt',
    name: '린넨 셔츠',
    nameEn: 'Linen Shirt',
    category: 'TOP',
    imageUrl: '/assets/clothing/top/linen-shirt.webp',
    tempLevels: ['HOT'],
    tags: ['시원', '여름'],
  },
  {
    id: 'top-sleeveless',
    name: '민소매/탱크탑',
    nameEn: 'Sleeveless',
    category: 'TOP',
    imageUrl: '/assets/clothing/top/sleeveless.webp',
    tempLevels: ['SCORCHING'],
    tags: ['시원', '여름'],
  },
  {
    id: 'top-blouse',
    name: '블라우스',
    nameEn: 'Blouse',
    category: 'TOP',
    imageUrl: '/assets/clothing/top/blouse.webp',
    tempLevels: ['MILD', 'WARM'],
    tags: ['포멀', '여성'],
  },
  {
    id: 'top-crop',
    name: '크롭탑',
    nameEn: 'Crop Top',
    category: 'TOP',
    imageUrl: '/assets/clothing/top/crop.webp',
    tempLevels: ['SCORCHING'],
    tags: ['시원', '여름'],
  },
];

// === 하의 (BOTTOM) — 7종 ===
const bottomItems: ClothingItem[] = [
  {
    id: 'bottom-fleece-pants',
    name: '기모바지',
    nameEn: 'Fleece Pants',
    category: 'BOTTOM',
    imageUrl: '/assets/clothing/bottom/fleece-pants.webp',
    tempLevels: ['FREEZING', 'COLD'],
    tags: ['방한', '겨울'],
  },
  {
    id: 'bottom-jeans',
    name: '청바지',
    nameEn: 'Jeans',
    category: 'BOTTOM',
    imageUrl: '/assets/clothing/bottom/jeans.webp',
    tempLevels: ['COLD', 'CHILLY', 'MILD'],
    tags: ['캐주얼', '기본'],
  },
  {
    id: 'bottom-chino',
    name: '면바지/치노',
    nameEn: 'Chino Pants',
    category: 'BOTTOM',
    imageUrl: '/assets/clothing/bottom/chino.webp',
    tempLevels: ['MILD', 'WARM'],
    tags: ['캐주얼', '깔끔'],
  },
  {
    id: 'bottom-slacks',
    name: '슬랙스',
    nameEn: 'Slacks',
    category: 'BOTTOM',
    imageUrl: '/assets/clothing/bottom/slacks.webp',
    tempLevels: ['CHILLY', 'MILD', 'WARM'],
    tags: ['포멀', '깔끔'],
  },
  {
    id: 'bottom-linen',
    name: '린넨팬츠',
    nameEn: 'Linen Pants',
    category: 'BOTTOM',
    imageUrl: '/assets/clothing/bottom/linen.webp',
    tempLevels: ['HOT'],
    tags: ['시원', '여름'],
  },
  {
    id: 'bottom-shorts',
    name: '반바지',
    nameEn: 'Shorts',
    category: 'BOTTOM',
    imageUrl: '/assets/clothing/bottom/shorts.webp',
    tempLevels: ['HOT', 'SCORCHING'],
    tags: ['시원', '여름'],
  },
  {
    id: 'bottom-short-skirt',
    name: '숏팬츠/치마',
    nameEn: 'Short Pants/Skirt',
    category: 'BOTTOM',
    imageUrl: '/assets/clothing/bottom/short-skirt.webp',
    tempLevels: ['SCORCHING'],
    tags: ['시원', '여름'],
  },
];

// === 신발 (SHOES) — 6종 ===
const shoesItems: ClothingItem[] = [
  {
    id: 'shoes-boots',
    name: '부츠',
    nameEn: 'Boots',
    category: 'SHOES',
    imageUrl: '/assets/clothing/shoes/boots.webp',
    tempLevels: ['FREEZING', 'COLD'],
    tags: ['방한', '겨울'],
  },
  {
    id: 'shoes-rain-boots',
    name: '레인부츠',
    nameEn: 'Rain Boots',
    category: 'SHOES',
    imageUrl: '/assets/clothing/shoes/rain-boots.webp',
    tempLevels: ['COLD', 'CHILLY', 'MILD'],
    tags: ['비', '방수'],
  },
  {
    id: 'shoes-sneakers',
    name: '운동화',
    nameEn: 'Sneakers',
    category: 'SHOES',
    imageUrl: '/assets/clothing/shoes/sneakers.webp',
    tempLevels: ['CHILLY', 'MILD', 'WARM'],
    tags: ['캐주얼', '기본'],
  },
  {
    id: 'shoes-loafer',
    name: '로퍼/구두',
    nameEn: 'Loafer',
    category: 'SHOES',
    imageUrl: '/assets/clothing/shoes/loafer.webp',
    tempLevels: ['MILD', 'WARM'],
    tags: ['포멀', '깔끔'],
  },
  {
    id: 'shoes-canvas',
    name: '캔버스/슬립온',
    nameEn: 'Canvas',
    category: 'SHOES',
    imageUrl: '/assets/clothing/shoes/canvas.webp',
    tempLevels: ['WARM', 'HOT'],
    tags: ['캐주얼', '여름'],
  },
  {
    id: 'shoes-sandals',
    name: '샌들/슬리퍼',
    nameEn: 'Sandals',
    category: 'SHOES',
    imageUrl: '/assets/clothing/shoes/sandals.webp',
    tempLevels: ['HOT', 'SCORCHING'],
    tags: ['시원', '여름'],
  },
];

// === 소품 (ACCESSORY) — 10종 ===
const accessoryItems: ClothingItem[] = [
  {
    id: 'acc-scarf',
    name: '목도리/머플러',
    nameEn: 'Scarf',
    category: 'ACCESSORY',
    imageUrl: '/assets/clothing/accessory/scarf.webp',
    tempLevels: ['FREEZING', 'COLD'],
    tags: ['방한', '겨울'],
  },
  {
    id: 'acc-gloves',
    name: '장갑',
    nameEn: 'Gloves',
    category: 'ACCESSORY',
    imageUrl: '/assets/clothing/accessory/gloves.webp',
    tempLevels: ['FREEZING'],
    tags: ['방한', '겨울'],
  },
  {
    id: 'acc-beanie',
    name: '방한모/비니',
    nameEn: 'Beanie',
    category: 'ACCESSORY',
    imageUrl: '/assets/clothing/accessory/beanie.webp',
    tempLevels: ['FREEZING', 'COLD'],
    tags: ['방한', '겨울'],
  },
  {
    id: 'acc-cap',
    name: '모자',
    nameEn: 'Cap/Bucket Hat',
    category: 'ACCESSORY',
    imageUrl: '/assets/clothing/accessory/cap.webp',
    tempLevels: ['WARM', 'HOT', 'SCORCHING'],
    tags: ['UV차단', '여름'],
  },
  {
    id: 'acc-sunglasses',
    name: '선글라스',
    nameEn: 'Sunglasses',
    category: 'ACCESSORY',
    imageUrl: '/assets/clothing/accessory/sunglasses.webp',
    tempLevels: ['WARM', 'HOT', 'SCORCHING'],
    tags: ['UV차단', '여름'],
  },
  {
    id: 'acc-umbrella',
    name: '우산',
    nameEn: 'Umbrella',
    category: 'ACCESSORY',
    imageUrl: '/assets/clothing/accessory/umbrella.webp',
    tempLevels: ['FREEZING', 'COLD', 'CHILLY', 'MILD', 'WARM', 'HOT', 'SCORCHING'],
    tags: ['비', '필수'],
  },
  {
    id: 'acc-mask',
    name: '마스크',
    nameEn: 'Mask',
    category: 'ACCESSORY',
    imageUrl: '/assets/clothing/accessory/mask.webp',
    tempLevels: ['FREEZING', 'COLD', 'CHILLY', 'MILD', 'WARM', 'HOT', 'SCORCHING'],
    tags: ['미세먼지', '건강'],
  },
  {
    id: 'acc-sunscreen',
    name: '선크림',
    nameEn: 'Sunscreen',
    category: 'ACCESSORY',
    imageUrl: '/assets/clothing/accessory/sunscreen.webp',
    tempLevels: ['WARM', 'HOT', 'SCORCHING'],
    tags: ['UV차단', '여름'],
  },
  {
    id: 'acc-bag',
    name: '가방',
    nameEn: 'Bag',
    category: 'ACCESSORY',
    imageUrl: '/assets/clothing/accessory/bag.webp',
    tempLevels: ['FREEZING', 'COLD', 'CHILLY', 'MILD', 'WARM', 'HOT', 'SCORCHING'],
    tags: ['기본', '캐주얼'],
  },
  {
    id: 'acc-hotpack',
    name: '핫팩',
    nameEn: 'Hand Warmer',
    category: 'ACCESSORY',
    imageUrl: '/assets/clothing/accessory/hotpack.webp',
    tempLevels: ['FREEZING', 'COLD'],
    tags: ['방한', '겨울'],
  },
];

/** 전체 의류 아이템 목록 */
export const CLOTHING_ITEMS: ClothingItem[] = [
  ...outerItems,
  ...topItems,
  ...bottomItems,
  ...shoesItems,
  ...accessoryItems,
];

/** 카테고리별 아이템 조회 */
export function getItemsByCategory(category: Category): ClothingItem[] {
  return CLOTHING_ITEMS.filter((item) => item.category === category);
}

/** 온도 레벨 + 카테고리별 아이템 조회 */
export function getItemsForTempLevel(
  level: TempLevel,
  category: Category,
): ClothingItem[] {
  return CLOTHING_ITEMS.filter(
    (item) => item.category === category && item.tempLevels.includes(level),
  );
}

/** ID로 아이템 조회 */
export function getItemById(id: string): ClothingItem | undefined {
  return CLOTHING_ITEMS.find((item) => item.id === id);
}
