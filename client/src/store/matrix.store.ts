import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TestStructureItem {
  id: string;
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
  removeStructure: (id: string) => void;
  clearStructures: () => void;
}

// ✅ Thêm persist middleware
export const useMatrixStore = create<MatrixState>()(
  persist(
    (set) => ({
      structures: [],
      addStructure: (item) =>
        set((state) => ({
          structures: [
            ...state.structures,
            { id: crypto.randomUUID(), ...item },
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
