import { COMMENTS, getRandomComment } from '../comments';
import { TEMP_LEVELS } from '@/types/outfit';

describe('comments', () => {
  it('모든 TempLevel에 대한 코멘트가 존재해야 한다', () => {
    for (const level of TEMP_LEVELS) {
      expect(COMMENTS[level]).toBeDefined();
      expect(COMMENTS[level]!.length).toBeGreaterThan(0);
    }
  });

  it('각 TempLevel에 최소 3개의 코멘트가 있어야 한다', () => {
    for (const level of TEMP_LEVELS) {
      expect(COMMENTS[level]!.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('getRandomComment가 해당 레벨의 코멘트를 반환해야 한다', () => {
    const comment = getRandomComment('FREEZING');
    expect(COMMENTS.FREEZING).toContain(comment);
  });

  it('getRandomComment가 빈 문자열을 반환하지 않아야 한다', () => {
    for (const level of TEMP_LEVELS) {
      const comment = getRandomComment(level);
      expect(comment.length).toBeGreaterThan(0);
    }
  });

  it('모든 코멘트가 한글을 포함해야 한다', () => {
    const koreanRegex = /[가-힣]/;
    for (const level of TEMP_LEVELS) {
      for (const comment of COMMENTS[level]!) {
        expect(comment).toMatch(koreanRegex);
      }
    }
  });
});
