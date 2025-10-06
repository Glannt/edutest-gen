// src/store/grade-subject.store.ts
import { create } from 'zustand';

import {
  gradeSubjectService,
  ChapterPayload,
} from '@/service/grade-subject.service';
import { SubjectPayload } from '@/types/subject';

type GradeSubjectState = {
  subjects: SubjectPayload[];
  chapters: ChapterPayload[];
  loading: boolean;
  error: string | null;
  selectedGradeId: number | null;
  selectedSubjectId: number | null;
};

type GradeSubjectActions = {
  setGrade: (gradeId: number | null) => void;
  setSubject: (subjectId: number | null) => void;
  fetchSubjectsByGrade: (gradeId: number) => Promise<void>;
  fetchChaptersByGradeAndSubject: (
    gradeId: number,
    subjectId: number
  ) => Promise<void>;
  clear: () => void;
};

export const useGradeSubjectStore = create<
  GradeSubjectState & GradeSubjectActions
>((set) => ({
  subjects: [],
  chapters: [],
  loading: false,
  error: null,
  selectedGradeId: null,
  selectedSubjectId: null,

  setGrade: (gradeId) => set({ selectedGradeId: gradeId }),
  setSubject: (subjectId) => set({ selectedSubjectId: subjectId }),

  fetchSubjectsByGrade: async (gradeId) => {
    try {
      set({ loading: true });
      const subjects = await gradeSubjectService.getSubjectsByGrade(gradeId);

      set({ subjects, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchChaptersByGradeAndSubject: async (gradeId, subjectId) => {
    try {
      set({ loading: true });
      const chapters = await gradeSubjectService.getChaptersByGradeAndSubject(
        gradeId,
        subjectId
      );

      set({ chapters, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  clear: () =>
    set({
      subjects: [],
      chapters: [],
      loading: false,
      error: null,
      selectedGradeId: null,
      selectedSubjectId: null,
    }),
}));
