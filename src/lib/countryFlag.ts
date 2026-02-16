/** ISO 3166-1 alpha-2 국가 코드를 국기 이모지로 변환 */
export function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) return '';
  return [...code.toUpperCase()].map(c =>
    String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
  ).join('');
}
