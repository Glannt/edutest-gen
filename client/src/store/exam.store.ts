// src/store/useExamStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ExamQuestionRequest, CreateExamRequest } from '@/types/exam';

interface ExamInfo {
  code?: string;
  name: string;
  matrixId: number;
  startTime?: string;
  endTime?: string;
  shuffleQuestions?: boolean;
}

interface ExamStoreState {
  examInfo: ExamInfo | null;
  questions: ExamQuestionRequest[];
  setExamInfo: (info: ExamInfo) => void;
  addQuestion: (q: ExamQuestionRequest) => void;
  removeQuestion: (questionId: number) => void;
  clearQuestions: () => void;
  buildCreateExamRequest: () => CreateExamRequest;
}

export const useExamStore = create<ExamStoreState>()(
  persist(
    (set, get) => ({
      examInfo: null,
      questions: [],

      setExamInfo: (info: ExamInfo) => set({ examInfo: info }),

      addQuestion: (q: ExamQuestionRequest) =>
        set((state) => ({ questions: [...state.questions, q] })),

      removeQuestion: (questionId: number) =>
        set((state) => ({
          questions: state.questions.filter((q) => q.questionId !== questionId),
        })),

      clearQuestions: () => set({ questions: [] }),

      buildCreateExamRequest: (): CreateExamRequest => {
        const examInfo = get().examInfo;
        const questions = get().questions;

        if (!examInfo) throw new Error('Exam info chưa được set.');

        return {
          code: examInfo.code,
          name: examInfo.name,
          matrixId: examInfo.matrixId,
          startTime: examInfo.startTime,
          endTime: examInfo.endTime,
          shuffleQuestions: examInfo.shuffleQuestions,
          questions: questions,
        };
      },
    }),
    { name: 'exam-storage' } // persist key
  )
);
