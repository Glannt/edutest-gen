import { create } from 'zustand';

import { gradeService } from '@/service/grade.service';
import { GradePayload } from '@/types/grade';

type GradeState = {
  grades: GradePayload[];
  loading: boolean;
  error: string | null;
  selectedGrade: GradePayload | null;
};

type GradeActions = {
  fetchGrades: () => Promise<void>;
  fetchGradeById: (id: number) => Promise<void>;
  createGrade: (payload: Partial<GradePayload>) => Promise<GradePayload | null>;
  updateGrade: (
    id: number,
    payload: Partial<GradePayload>
  ) => Promise<GradePayload | null>;
  deleteGrade: (id: number) => Promise<void>;
  clearError: () => void;
};

export const useGradeStore = create<GradeState & GradeActions>((set, get) => ({
  grades: [],
  loading: false,
  error: null,
  selectedGrade: null,

  clearError: () => set({ error: null }),

  fetchGrades: async () => {
    try {
      set({ loading: true });
      const data = await gradeService.getAll();

      set({ grades: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchGradeById: async (id: number) => {
    try {
      set({ loading: true });
      const grade = await gradeService.getById(id);

      set({ selectedGrade: grade, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  createGrade: async (payload: Partial<GradePayload>) => {
    try {
      set({ loading: true });
      const newGrade = await gradeService.create(payload);

      set({ grades: [...get().grades, newGrade], loading: false });

      return newGrade;
    } catch (err: any) {
      set({ error: err.message, loading: false });

      return null;
    }
  },

  updateGrade: async (id: number, payload: Partial<GradePayload>) => {
    try {
      set({ loading: true });
      const updated = await gradeService.update(id, payload);

      set({
        grades: get().grades.map((g) => (g.id === id ? updated : g)),
        loading: false,
      });

      return updated;
    } catch (err: any) {
      set({ error: err.message, loading: false });

      return null;
    }
  },

  deleteGrade: async (id: number) => {
    try {
      set({ loading: true });
      await gradeService.delete(id);
      set({
        grades: get().grades.filter((g) => g.id !== id),
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
