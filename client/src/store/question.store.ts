import { create } from 'zustand';

import { questionService } from '@/service/question.service';
import { QuestionPayload } from '@/types/question';

type QuestionState = {
  questions: QuestionPayload[];
  selectedQuestion: QuestionPayload | null;
  loading: boolean;
  error: string | null;
};

type QuestionActions = {
  fetchQuestions: () => Promise<void>;
  fetchQuestionById: (id: number) => Promise<void>;
  createQuestion: (
    payload: Partial<QuestionPayload>
  ) => Promise<QuestionPayload | null>;
  updateQuestion: (
    id: number,
    payload: Partial<QuestionPayload>
  ) => Promise<QuestionPayload | null>;
  deleteQuestion: (id: number) => Promise<void>;
  clearError: () => void;
};

export const useQuestionStore = create<QuestionState & QuestionActions>(
  (set, get) => ({
    questions: [],
    selectedQuestion: null,
    loading: false,
    error: null,

    clearError: () => set({ error: null }),

    fetchQuestions: async () => {
      try {
        set({ loading: true });
        const data = await questionService.getAll();

        set({ questions: data, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    fetchQuestionById: async (id: number) => {
      try {
        set({ loading: true });
        const question = await questionService.getById(id);

        set({ selectedQuestion: question, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    createQuestion: async (payload: Partial<QuestionPayload>) => {
      try {
        set({ loading: true });
        const newQuestion = await questionService.create(payload);

        set({ questions: [...get().questions, newQuestion], loading: false });

        return newQuestion;
      } catch (err: any) {
        set({ error: err.message, loading: false });

        return null;
      }
    },

    updateQuestion: async (id: number, payload: Partial<QuestionPayload>) => {
      try {
        set({ loading: true });
        const updated = await questionService.update(id, payload);

        set({
          questions: get().questions.map((q) => (q.id === id ? updated : q)),
          loading: false,
        });

        return updated;
      } catch (err: any) {
        set({ error: err.message, loading: false });

        return null;
      }
    },

    deleteQuestion: async (id: number) => {
      try {
        set({ loading: true });
        await questionService.delete(id);
        set({
          questions: get().questions.filter((q) => q.id !== id),
          loading: false,
        });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },
  })
);
