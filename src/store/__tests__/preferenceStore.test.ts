import { usePreferenceStore } from '../preferenceStore';

describe('preferenceStore', () => {
  beforeEach(() => {
    usePreferenceStore.setState({
      preferences: { dislikedItemIds: [], gender: null },
      isPreferencesModalOpen: false,
    });
    localStorage.clear();
  });

  it('초기 상태: 빈 dislikedItemIds', () => {
    const state = usePreferenceStore.getState();
    expect(state.preferences.dislikedItemIds).toEqual([]);
    expect(state.isPreferencesModalOpen).toBe(false);
  });

  it('dislikeItem은 아이템을 추가한다', () => {
    usePreferenceStore.getState().dislikeItem('outer-long-puffer');
    expect(usePreferenceStore.getState().preferences.dislikedItemIds).toContain('outer-long-puffer');
  });

  it('dislikeItem은 중복 추가하지 않는다', () => {
    usePreferenceStore.getState().dislikeItem('outer-long-puffer');
    usePreferenceStore.getState().dislikeItem('outer-long-puffer');
    expect(usePreferenceStore.getState().preferences.dislikedItemIds).toHaveLength(1);
  });

  it('undislikeItem은 아이템을 제거한다', () => {
    usePreferenceStore.getState().dislikeItem('outer-long-puffer');
    usePreferenceStore.getState().undislikeItem('outer-long-puffer');
    expect(usePreferenceStore.getState().preferences.dislikedItemIds).not.toContain('outer-long-puffer');
  });

  it('toggleDislike은 토글한다', () => {
    usePreferenceStore.getState().toggleDislike('top-heattech');
    expect(usePreferenceStore.getState().isDisliked('top-heattech')).toBe(true);

    usePreferenceStore.getState().toggleDislike('top-heattech');
    expect(usePreferenceStore.getState().isDisliked('top-heattech')).toBe(false);
  });

  it('isDisliked는 정확한 boolean을 반환한다', () => {
    expect(usePreferenceStore.getState().isDisliked('outer-coat')).toBe(false);
    usePreferenceStore.getState().dislikeItem('outer-coat');
    expect(usePreferenceStore.getState().isDisliked('outer-coat')).toBe(true);
  });

  it('clearAllDislikes는 전부 초기화한다', () => {
    usePreferenceStore.getState().dislikeItem('outer-long-puffer');
    usePreferenceStore.getState().dislikeItem('top-heattech');
    usePreferenceStore.getState().clearAllDislikes();
    expect(usePreferenceStore.getState().preferences.dislikedItemIds).toEqual([]);
  });

  it('dislikeItem은 localStorage에 저장한다', () => {
    usePreferenceStore.getState().dislikeItem('outer-coat');
    const stored = localStorage.getItem('weatherfit-preferences');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!).dislikedItemIds).toContain('outer-coat');
  });

  it('hydrateFromStorage는 유효한 데이터를 복원한다', () => {
    localStorage.setItem('weatherfit-preferences', JSON.stringify({
      dislikedItemIds: ['outer-long-puffer', 'top-heattech'],
    }));
    usePreferenceStore.getState().hydrateFromStorage();
    expect(usePreferenceStore.getState().preferences.dislikedItemIds).toEqual(['outer-long-puffer', 'top-heattech']);
  });

  it('hydrateFromStorage는 손상된 데이터를 무시한다', () => {
    localStorage.setItem('weatherfit-preferences', 'broken-json');
    usePreferenceStore.getState().hydrateFromStorage();
    expect(usePreferenceStore.getState().preferences.dislikedItemIds).toEqual([]);
  });

  it('hydrateFromStorage는 빈 localStorage에서 아무것도 안 한다', () => {
    usePreferenceStore.getState().hydrateFromStorage();
    expect(usePreferenceStore.getState().preferences.dislikedItemIds).toEqual([]);
  });

  it('모달 open/close 토글', () => {
    usePreferenceStore.getState().openPreferencesModal();
    expect(usePreferenceStore.getState().isPreferencesModalOpen).toBe(true);
    usePreferenceStore.getState().closePreferencesModal();
    expect(usePreferenceStore.getState().isPreferencesModalOpen).toBe(false);
  });

  // === 성별 선호도 ===
  it('초기 상태: gender는 null이다', () => {
    expect(usePreferenceStore.getState().preferences.gender).toBeNull();
  });

  it("setGender('M')은 gender를 M으로 설정한다", () => {
    usePreferenceStore.getState().setGender('M');
    expect(usePreferenceStore.getState().preferences.gender).toBe('M');
  });

  it("setGender(null)은 gender를 null로 설정한다", () => {
    usePreferenceStore.getState().setGender('F');
    usePreferenceStore.getState().setGender(null);
    expect(usePreferenceStore.getState().preferences.gender).toBeNull();
  });

  it('setGender는 localStorage에 저장한다', () => {
    usePreferenceStore.getState().setGender('F');
    const stored = JSON.parse(localStorage.getItem('weatherfit-preferences')!);
    expect(stored.gender).toBe('F');
  });

  it('hydrateFromStorage는 gender를 복원한다', () => {
    localStorage.setItem('weatherfit-preferences', JSON.stringify({
      dislikedItemIds: [], gender: 'M',
    }));
    usePreferenceStore.getState().hydrateFromStorage();
    expect(usePreferenceStore.getState().preferences.gender).toBe('M');
  });

  it('hydrateFromStorage는 잘못된 gender를 null로 복원한다', () => {
    localStorage.setItem('weatherfit-preferences', JSON.stringify({
      dislikedItemIds: [], gender: 'INVALID',
    }));
    usePreferenceStore.getState().hydrateFromStorage();
    expect(usePreferenceStore.getState().preferences.gender).toBeNull();
  });

  it('기존 데이터(gender 없음)에서 hydrate하면 gender=null', () => {
    localStorage.setItem('weatherfit-preferences', JSON.stringify({
      dislikedItemIds: ['outer-coat'],
    }));
    usePreferenceStore.getState().hydrateFromStorage();
    expect(usePreferenceStore.getState().preferences.gender).toBeNull();
    expect(usePreferenceStore.getState().preferences.dislikedItemIds).toEqual(['outer-coat']);
  });

  it('clearAllDislikes는 gender를 유지한다', () => {
    usePreferenceStore.getState().setGender('F');
    usePreferenceStore.getState().dislikeItem('outer-coat');
    usePreferenceStore.getState().clearAllDislikes();
    expect(usePreferenceStore.getState().preferences.dislikedItemIds).toEqual([]);
    expect(usePreferenceStore.getState().preferences.gender).toBe('F');
  });
});
