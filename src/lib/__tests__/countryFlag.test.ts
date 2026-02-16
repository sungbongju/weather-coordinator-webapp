import { describe, it, expect } from 'vitest';
import { countryCodeToFlag } from '../countryFlag';

describe('countryCodeToFlag', () => {
  it('KR → 🇰🇷', () => {
    expect(countryCodeToFlag('KR')).toBe('🇰🇷');
  });

  it('US → 🇺🇸', () => {
    expect(countryCodeToFlag('US')).toBe('🇺🇸');
  });

  it('JP → 🇯🇵', () => {
    expect(countryCodeToFlag('JP')).toBe('🇯🇵');
  });

  it('소문자도 처리한다', () => {
    expect(countryCodeToFlag('kr')).toBe('🇰🇷');
  });

  it('빈 문자열이면 빈 문자열 반환', () => {
    expect(countryCodeToFlag('')).toBe('');
  });

  it('2글자가 아니면 빈 문자열 반환', () => {
    expect(countryCodeToFlag('KOR')).toBe('');
  });
});
