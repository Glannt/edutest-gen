// src/store/auth.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { User } from '@/types/user';

type AuthState = {
  user: User | null;
  token: string | null;
  tokenExp?: number | null; // optional expiration timestamp
};

type AuthActions = {
  /** Lưu thông tin user + token */
  setAuth: (data: { user: User; token: string; tokenExp?: number }) => void;
  /** Xóa dữ liệu đăng nhập */
  clearAuth: () => void;
  /** Kiểm tra token còn hạn hay không */
  isTokenValid: () => boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  tokenExp: null,
};

/**
 * ✅ useAuthStore — quản lý thông tin đăng nhập, lưu localStorage
 * - Lưu token + user vào storage
 * - Xóa khi token hết hạn
 * - Có helper `isTokenValid()` để kiểm tra hạn token (exp)
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAuth: ({ user, token, tokenExp }) => {
        set({ user, token, tokenExp });
      },

      clearAuth: () => set({ ...initialState }),

      isTokenValid: () => {
        const exp = get().tokenExp;

        if (!exp) return true; // không có exp thì không kiểm tra
        const now = Math.floor(Date.now() / 1000);

        return exp > now;
      },
    }),
    {
      name: 'auth-edutest-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        tokenExp: state.tokenExp,
      }),
    }
  )
);
