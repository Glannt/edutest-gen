import { create } from 'zustand';

import { subjectService } from '@/service/subject.service';
import { SubjectPayload } from '@/types/subject';

type SubjectState = {
  subjects: SubjectPayload[];
  selectedSubject: SubjectPayload | null;
  loading: boolean;
  error: string | null;
};

type SubjectActions = {
  fetchSubjects: () => Promise<void>;
  fetchSubjectById: (id: number) => Promise<void>;
  createSubject: (
    payload: Partial<SubjectPayload>
  ) => Promise<SubjectPayload | null>;
  updateSubject: (
    id: number,
    payload: Partial<SubjectPayload>
  ) => Promise<SubjectPayload | null>;
  deleteSubject: (id: number) => Promise<void>;
  searchSubjects: (name: string) => Promise<void>;
  clearError: () => void;
};

export const useSubjectStore = create<SubjectState & SubjectActions>(
  (set, get) => ({
    subjects: [],
    selectedSubject: null,
    loading: false,
    error: null,

    clearError: () => set({ error: null }),

    fetchSubjects: async () => {
      try {
        set({ loading: true });
        const data = await subjectService.getAll();

        set({ subjects: data, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    fetchSubjectById: async (id: number) => {
      try {
        set({ loading: true });
        const data = await subjectService.getById(id);

        set({ selectedSubject: data, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    createSubject: async (payload: Partial<SubjectPayload>) => {
      try {
        set({ loading: true });
        const newSubject = await subjectService.create(payload);

        set({ subjects: [...get().subjects, newSubject], loading: false });

        return newSubject;
      } catch (err: any) {
        set({ error: err.message, loading: false });

        return null;
      }
    },

    updateSubject: async (id: number, payload: Partial<SubjectPayload>) => {
      try {
        set({ loading: true });
        const updated = await subjectService.update(id, payload);

        set({
          subjects: get().subjects.map((s) => (s.id === id ? updated : s)),
          loading: false,
        });

        return updated;
      } catch (err: any) {
        set({ error: err.message, loading: false });

        return null;
      }
    },

    deleteSubject: async (id: number) => {
      try {
        set({ loading: true });
        await subjectService.delete(id);
        set({
          subjects: get().subjects.filter((s) => s.id !== id),
          loading: false,
        });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    searchSubjects: async (name: string) => {
      try {
        set({ loading: true });
        const results = await subjectService.searchByName(name);

        set({ subjects: results, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },
  })
);
