import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { MatrixRequest } from '@/types/matrix';

interface TestStructureItemRaw {
  id: number;
  gradeId: number;
  subjectId: number;
  chapterId: number;
  lessonId: number;
  levelId: number;
  questionTypeId: number;
  questionCount: number;
  name?: string;
  description?: string;
  totalQuestions?: string;
}

interface MatrixInfo {
  name: string;
  description?: string;
  totalQuestions: number;
  totalScore: number;
}

interface MatrixState {
  structures: TestStructureItemRaw[];
  matrixInfo: MatrixInfo | null;
  addStructure: (item: Omit<TestStructureItemRaw, 'id'>) => void;
  removeStructure: (id: number) => void;
  clearStructures: () => void;
  setMatrixInfo: (info: MatrixInfo) => void;
  buildMatrixRequest: () => MatrixRequest;
}

let nextId = 1;

export const useMatrixStore = create<MatrixState>()(
  persist(
    (set, get) => ({
      structures: [],
      matrixInfo: null, // <-- fix: khởi tạo mặc định
      addStructure: (item) =>
        set((state) => ({
          structures: [...state.structures, { id: nextId++, ...item }],
        })),
      removeStructure: (id) =>
        set((state) => ({
          structures: state.structures.filter((s) => s.id !== id),
        })),
      clearStructures: () => set({ structures: [] }),
      setMatrixInfo: (info: MatrixInfo) => set({ matrixInfo: info }),

      buildMatrixRequest: () => {
        const structures = get().structures;
        const matrixInfo = get().matrixInfo;

        if (!matrixInfo) {
          throw new Error('Matrix info is not set.');
        }
        // Tính tổng questionCount của tất cả structure
        const totalQuestionsInStructures = structures.reduce(
          (sum, s) => sum + (s.questionCount || 0),
          0
        );

        // Nếu tổng questionCount vượt quá totalQuestions, throw lỗi
        if (totalQuestionsInStructures > matrixInfo.totalQuestions) {
          throw new Error(
            `Tổng số câu (${totalQuestionsInStructures}) vượt quá tổng câu tối đa (${matrixInfo.totalQuestions}).`
          );
        }

        return {
          name: matrixInfo.name,
          description: matrixInfo.description,
          totalQuestions: matrixInfo.totalQuestions,
          totalScore: matrixInfo.totalScore,
          matrixDetails: structures.map((s) => ({
            lessonId: s.lessonId,
            levelId: s.levelId,
            questionTypeId: s.questionTypeId,
            quantity: s.questionCount,
          })),
        };
      },
    }),
    { name: 'matrix-storage' }
  )
);
