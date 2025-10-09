import { create } from 'zustand';

import { optionService } from '@/service/option.service';
import { OptionPayload } from '@/types/option';

type OptionState = {
  options: OptionPayload[];
  selectedOption: OptionPayload | null;
  loading: boolean;
  error: string | null;
};

type OptionActions = {
  fetchOptions: () => Promise<void>;
  fetchOptionById: (id: number) => Promise<void>;
  createOption: (
    payload: Partial<OptionPayload>
  ) => Promise<OptionPayload | null>;
  updateOption: (
    id: number,
    payload: Partial<OptionPayload>
  ) => Promise<OptionPayload | null>;
  deleteOption: (id: number) => Promise<void>;
  clearError: () => void;
};

export const useOptionStore = create<OptionState & OptionActions>(
  (set, get) => ({
    options: [],
    selectedOption: null,
    loading: false,
    error: null,

    clearError: () => set({ error: null }),

    fetchOptions: async () => {
      try {
        set({ loading: true });
        const data = await optionService.getAll();

        set({ options: data, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    fetchOptionById: async (id: number) => {
      try {
        set({ loading: true });
        const option = await optionService.getById(id);

        set({ selectedOption: option, loading: false });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    createOption: async (payload: Partial<OptionPayload>) => {
      try {
        set({ loading: true });
        const newOption = await optionService.create(payload);

        set({ options: [...get().options, newOption], loading: false });

        return newOption;
      } catch (err: any) {
        set({ error: err.message, loading: false });

        return null;
      }
    },

    updateOption: async (id: number, payload: Partial<OptionPayload>) => {
      try {
        set({ loading: true });
        const updated = await optionService.update(id, payload);

        set({
          options: get().options.map((opt) => (opt.id === id ? updated : opt)),
          loading: false,
        });

        return updated;
      } catch (err: any) {
        set({ error: err.message, loading: false });

        return null;
      }
    },

    deleteOption: async (id: number) => {
      try {
        set({ loading: true });
        await optionService.delete(id);
        set({
          options: get().options.filter((opt) => opt.id !== id),
          loading: false,
        });
      } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },
  })
);
