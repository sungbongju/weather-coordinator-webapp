import { create } from 'zustand';
import type { UserPreferences } from '@/types/outfit';

const STORAGE_KEY = 'weatherfit-preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  dislikedItemIds: [],
};

interface PreferenceStore {
  preferences: UserPreferences;
  isPreferencesModalOpen: boolean;

  dislikeItem: (itemId: string) => void;
  undislikeItem: (itemId: string) => void;
  toggleDislike: (itemId: string) => void;
  isDisliked: (itemId: string) => boolean;
  clearAllDislikes: () => void;
  openPreferencesModal: () => void;
  closePreferencesModal: () => void;
  hydrateFromStorage: () => void;
}

function persistToStorage(prefs: UserPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage 사용 불가 시 무시
  }
}

export const usePreferenceStore = create<PreferenceStore>((set, get) => ({
  preferences: { ...DEFAULT_PREFERENCES },
  isPreferencesModalOpen: false,

  dislikeItem: (itemId) => {
    const current = get().preferences.dislikedItemIds;
    if (current.includes(itemId)) return;
    const updated = { dislikedItemIds: [...current, itemId] };
    set({ preferences: updated });
    persistToStorage(updated);
  },

  undislikeItem: (itemId) => {
    const current = get().preferences.dislikedItemIds;
    const updated = { dislikedItemIds: current.filter(id => id !== itemId) };
    set({ preferences: updated });
    persistToStorage(updated);
  },

  toggleDislike: (itemId) => {
    if (get().preferences.dislikedItemIds.includes(itemId)) {
      get().undislikeItem(itemId);
    } else {
      get().dislikeItem(itemId);
    }
  },

  isDisliked: (itemId) => {
    return get().preferences.dislikedItemIds.includes(itemId);
  },

  clearAllDislikes: () => {
    const updated = { ...DEFAULT_PREFERENCES };
    set({ preferences: updated });
    persistToStorage(updated);
  },

  openPreferencesModal: () => set({ isPreferencesModalOpen: true }),
  closePreferencesModal: () => set({ isPreferencesModalOpen: false }),

  hydrateFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserPreferences;
        if (Array.isArray(parsed.dislikedItemIds)) {
          set({ preferences: parsed });
        }
      }
    } catch {
      // 손상된 데이터 무시
    }
  },
}));
