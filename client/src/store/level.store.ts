// src/store/level.store.ts
import { create } from 'zustand';

import { levelService } from '@/service/level.service';
import { LevelPayload } from '@/types/level';

type LevelState = {
  levels: LevelPayload[];
  loading: boolean;
  error: string | null;
  selectedLevel: LevelPayload | null;
};

type LevelActions = {
  fetchLevels: () => Promise<void>;
  fetchLevelById: (id: number) => Promise<void>;
  createLevel: (payload: Partial<LevelPayload>) => Promise<LevelPayload | null>;
  updateLevel: (
    id: number,
    payload: Partial<LevelPayload>
  ) => Promise<LevelPayload | null>;
  deleteLevel: (id: number) => Promise<void>;
  clearError: () => void;
};

export const useLevelStore = create<LevelState & LevelActions>((set, get) => ({
  levels: [],
  loading: false,
  error: null,
  selectedLevel: null,

  clearError: () => set({ error: null }),

  fetchLevels: async () => {
    try {
      set({ loading: true });
      const data = await levelService.getAll();

      set({ levels: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchLevelById: async (id: number) => {
    try {
      set({ loading: true });
      const level = await levelService.getById(id);

      set({ selectedLevel: level, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  createLevel: async (payload: Partial<LevelPayload>) => {
    try {
      set({ loading: true });
      const newLevel = await levelService.create(payload);

      set({ levels: [...get().levels, newLevel], loading: false });

      return newLevel;
    } catch (err: any) {
      set({ error: err.message, loading: false });

      return null;
    }
  },

  updateLevel: async (id: number, payload: Partial<LevelPayload>) => {
    try {
      set({ loading: true });
      const updated = await levelService.update(id, payload);

      set({
        levels: get().levels.map((lvl) => (lvl.id === id ? updated : lvl)),
        loading: false,
      });

      return updated;
    } catch (err: any) {
      set({ error: err.message, loading: false });

      return null;
    }
  },

  deleteLevel: async (id: number) => {
    try {
      set({ loading: true });
      await levelService.delete(id);
      set({
        levels: get().levels.filter((lvl) => lvl.id !== id),
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
