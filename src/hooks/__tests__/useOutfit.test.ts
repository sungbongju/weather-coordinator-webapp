import { renderHook } from '@testing-library/react';
import { useOutfit } from '../useOutfit';
import { mockWeatherMild, mockWeatherHot } from '@/__tests__/fixtures/weatherData';

describe('useOutfit', () => {
  it('weatherData가 있으면 추천 결과를 반환해야 한다', () => {
    const { result } = renderHook(() => useOutfit(mockWeatherMild));
    expect(result.current.recommendation).not.toBeNull();
    expect(result.current.recommendation?.tempLevel).toBe('MILD');
  });

  it('weatherData가 null이면 null을 반환해야 한다', () => {
    const { result } = renderHook(() => useOutfit(null));
    expect(result.current.recommendation).toBeNull();
  });

  it('weatherData가 변경되면 추천이 업데이트되어야 한다', () => {
    const { result, rerender } = renderHook(
      ({ weather }) => useOutfit(weather),
      { initialProps: { weather: mockWeatherMild } },
    );

    expect(result.current.recommendation?.tempLevel).toBe('MILD');

    rerender({ weather: mockWeatherHot });
    expect(result.current.recommendation?.tempLevel).toBe('HOT');
  });

  it('추천 결과가 OutfitRecommendation 타입이어야 한다', () => {
    const { result } = renderHook(() => useOutfit(mockWeatherMild));
    const rec = result.current.recommendation;

    expect(rec).toHaveProperty('tempLevel');
    expect(rec).toHaveProperty('top');
    expect(rec).toHaveProperty('bottom');
    expect(rec).toHaveProperty('shoes');
    expect(rec).toHaveProperty('accessories');
    expect(rec).toHaveProperty('comment');
    expect(rec).toHaveProperty('modifiers');
  });
});
