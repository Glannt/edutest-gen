import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { User } from '@/types/user';

type AuthState = {
  user: User | null;
  token: string | null;
};

type AuthActions = {
  setAuth: (data: { user: User | null; token: string | null }) => void;
  clearAuth: () => void;
};

const initialState: AuthState = {
  user: null,
  token: null,
};

/**
 * cần kiểm tra exp vì store sẽ tự clear khi token hết hạn (nếu bạn xử lý ở hook).
 */

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (data) => set({ user: data.user, token: data.token }),
      clearAuth: () => set({ ...initialState }),
    }),
    {
      name: 'auth-edutest-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
