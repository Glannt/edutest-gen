// src/store/chapter.store.ts
import { create } from 'zustand';

import { chapterService } from '@/service/chapter.service';
import { ChapterPayload } from '@/types/chapter';

type ChapterState = {
  chapters: ChapterPayload[];
  selectedChapter: ChapterPayload | null;
  loading: boolean;
  error: string | null;
};

type ChapterActions = {
  fetchChapters: () => Promise<void>;
  fetchChapterById: (id: number) => Promise<void>;
  createChapter: (
    payload: Partial<ChapterPayload>
  ) => Promise<ChapterPayload | null>;
  updateChapter: (
    id: number,
    payload: Partial<ChapterPayload>
  ) => Promise<ChapterPayload | null>;
  deleteChapter: (id: number) => Promise<void>;
  clearError: () => void;
};

export const useChapterStore = create<ChapterState & ChapterActions>(
  (set, get) => ({
    chapters: [],
    selectedChapter: null,
    loading: false,
    error: null,

    clearError: () => set({ error: null }),

    fetchChapters: async () => {
      try {
        set({ loading: true });
        const data = await chapterService.getAll();

        set({ chapters: data, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    fetchChapterById: async (id: number) => {
      try {
        set({ loading: true });
        const chapter = await chapterService.getById(id);

        set({ selectedChapter: chapter, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    createChapter: async (payload: Partial<ChapterPayload>) => {
      try {
        set({ loading: true });
        const newChapter = await chapterService.create(payload);

        set({ chapters: [...get().chapters, newChapter], loading: false });

        return newChapter;
      } catch (err: any) {
        set({ error: err.message, loading: false });

        return null;
      }
    },

    updateChapter: async (id: number, payload: Partial<ChapterPayload>) => {
      try {
        set({ loading: true });
        const updated = await chapterService.update(id, payload);

        set({
          chapters: get().chapters.map((c) => (c.id === id ? updated : c)),
          loading: false,
        });

        return updated;
      } catch (err: any) {
        set({ error: err.message, loading: false });

        return null;
      }
    },

    deleteChapter: async (id: number) => {
      try {
        set({ loading: true });
        await chapterService.delete(id);
        set({
          chapters: get().chapters.filter((c) => c.id !== id),
          loading: false,
        });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },
  })
);
