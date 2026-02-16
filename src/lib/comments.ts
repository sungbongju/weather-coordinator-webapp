import type { TempLevel } from '@/types/outfit';
import type { CommentTemplates } from '@/types/outfit';

export const COMMENTS: CommentTemplates = {
  FREEZING: [
    '밖에 나가면 코가 빨개져요. 완전무장 필수!',
    '이 추위엔 패딩이 예의입니다',
    '핫팩 2개는 기본이에요',
    '오늘은 집이 제일 따뜻해요',
    '롱패딩 없으면 후회합니다',
  ],
  COLD: [
    '코트 없이 나가면 후회합니다',
    '니트 위에 코트, 완벽한 조합!',
    '목도리 하나면 체감 5도 올라가요',
    '따뜻하게 입고 나가세요',
    '귀마개도 고려해보세요',
  ],
  CHILLY: [
    '자켓 하나 걸치면 딱 좋아요',
    '아침엔 쌀쌀하니 겉옷 챙기세요!',
    '가을 감성 뽑기 좋은 날씨',
    '트렌치코트가 딱인 날이에요',
    '레이어드하기 좋은 날씨예요',
  ],
  MILD: [
    '가디건 하나면 충분해요',
    '걸칠 거 하나만 챙기세요~',
    '제일 입기 좋은 날씨!',
    '나들이 가기 딱 좋은 날',
    '뭘 입어도 예쁜 날씨예요',
  ],
  WARM: [
    '긴팔 하나면 딱이에요',
    '얇은 셔츠가 정답인 날씨',
    '바람 불면 시원~ 완벽한 외출 날씨',
    '오늘은 산책하기 좋은 날이에요',
    '가볍게 입고 나가세요',
  ],
  HOT: [
    '반팔 반바지 국룰이죠',
    '시원하게 입으세요! 더워요',
    '선크림 필수! UV 주의보',
    '아이스 아메리카노가 필요한 날',
    '통풍 잘 되는 옷 추천이요',
  ],
  SCORCHING: [
    '밖에 나가지 마세요... 진심',
    '에어컨이 제일 좋은 옷입니다',
    '물 많이 드세요! 최소한의 옷차림으로!',
    '열사병 조심! 그늘을 찾으세요',
    '오늘은 실내 활동이 답이에요',
  ],
};

/** 주어진 온도 레벨에서 랜덤 코멘트 선택 */
export function getRandomComment(level: TempLevel): string {
  const comments = COMMENTS[level];
  if (!comments || comments.length === 0) {
    return '오늘도 좋은 하루 보내세요!';
  }
  const index = Math.floor(Math.random() * comments.length);
  return comments[index]!;
}
