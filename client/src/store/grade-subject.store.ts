// src/store/grade-subject.store.ts
import { create } from 'zustand';

import {
  gradeSubjectService,
  ChapterPayload,
} from '@/service/grade-subject.service';
import { SubjectPayload } from '@/types/subject';
import { lessonService } from '@/service/lesson.service';
import { levelService } from '@/service/level.service';
import { questionTypeService } from '@/service/question-type.service';

type GradeSubjectState = {
  subjects: SubjectPayload[];
  chapters: ChapterPayload[];
  lessons: any[];
  levels: any[];
  questionTypes: any[];
  loading: boolean;
  error: string | null;

  // selections
  selectedGradeId: number | null;
  selectedSubjectId: number | null;
  selectedChapterId: number | null;
  selectedLessonId: number | null;
  selectedLevelId: number | null;
  selectedQuestionTypeId: number | null;
};

type GradeSubjectActions = {
  setGrade: (gradeId: number | null) => Promise<void>;
  setSubject: (subjectId: number | null) => Promise<void>;
  setChapter: (chapterId: number | null) => Promise<void>;
  setLesson: (lessonId: number | null) => Promise<void>;
  setLevel: (levelId: number | null) => void;
  setQuestionType: (typeId: number | null) => void;
  clear: () => void;
};

export const useGradeSubjectStore = create<
  GradeSubjectState & GradeSubjectActions
>((set, get) => ({
  subjects: [],
  chapters: [],
  lessons: [],
  levels: [],
  questionTypes: [],
  loading: false,
  error: null,

  selectedGradeId: null,
  selectedSubjectId: null,
  selectedChapterId: null,
  selectedLessonId: null,
  selectedLevelId: null,
  selectedQuestionTypeId: null,

  // === Actions ===
  setGrade: async (gradeId) => {
    set({ selectedGradeId: gradeId, loading: true });
    if (!gradeId)
      return set({ subjects: [], chapters: [], lessons: [], loading: false });

    const subjects = await gradeSubjectService.getSubjectsByGrade(gradeId);

    set({
      subjects,
      selectedSubjectId: null,
      chapters: [],
      lessons: [],
      loading: false,
    });
  },

  setSubject: async (subjectId) => {
    const { selectedGradeId } = get();

    set({ selectedSubjectId: subjectId, loading: true });
    if (!subjectId || !selectedGradeId)
      return set({ chapters: [], lessons: [], loading: false });

    const chapters = await gradeSubjectService.getChaptersByGradeAndSubject(
      selectedGradeId,
      subjectId
    );

    set({ chapters, selectedChapterId: null, lessons: [], loading: false });
  },

  setChapter: async (chapterId) => {
    set({ selectedChapterId: chapterId, loading: true });
    if (!chapterId) return set({ lessons: [], loading: false });
    const lessons = await lessonService.getAllByChapter(chapterId);

    set({ lessons, loading: false });
  },

  setLesson: async (lessonId) => {
    set({ selectedLessonId: lessonId });
    if (lessonId) {
      const [levels, questionTypes] = await Promise.all([
        levelService.getAll(),
        questionTypeService.getAll(),
      ]);

      set({ levels, questionTypes });
    }
  },

  setLevel: (levelId) => set({ selectedLevelId: levelId }),
  setQuestionType: (typeId) => set({ selectedQuestionTypeId: typeId }),

  clear: () =>
    set({
      subjects: [],
      chapters: [],
      lessons: [],
      levels: [],
      questionTypes: [],
      selectedGradeId: null,
      selectedSubjectId: null,
      selectedChapterId: null,
      selectedLessonId: null,
      selectedLevelId: null,
      selectedQuestionTypeId: null,
    }),
}));
