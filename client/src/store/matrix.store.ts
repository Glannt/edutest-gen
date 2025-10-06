import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TestStructureItem {
  id: number; // đổi từ string sang number
  subject: string;
  grade: string;
  chapter: string;
  lesson: string;
  questionCount: number;
  level: string;
  questionType: string;
}

interface MatrixState {
  structures: TestStructureItem[];
  addStructure: (item: Omit<TestStructureItem, 'id'>) => void;
  removeStructure: (id: number) => void;
  clearStructures: () => void;
}

// Trợ giúp tạo id tự tăng
let nextId = 1;

export const useMatrixStore = create<MatrixState>()(
  persist(
    (set) => ({
      structures: [],
      addStructure: (item) =>
        set((state) => ({
          structures: [
            ...state.structures,
            { id: nextId++, ...item }, // tạo id kiểu number
          ],
        })),
      removeStructure: (id) =>
        set((state) => ({
          structures: state.structures.filter((s) => s.id !== id),
        })),
      clearStructures: () => set({ structures: [] }),
    }),
    {
      name: 'matrix-storage', // key lưu trong localStorage
    }
  )
);
