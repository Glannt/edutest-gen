// src/hooks/useRegister.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';
import { authService, RegisterPayload } from '@/service/auth.service';
import { AuthResponseData } from '@/types/auth';
import { User } from '@/types/user';
import { ApiResponse } from '@/types/api.response';

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      payload,
      role = 'TEACHER',
    }: {
      payload: RegisterPayload;
      role?: 'ADMIN' | 'TEACHER';
    }): Promise<AuthResponseData> => {
      const res: ApiResponse<AuthResponseData> = await authService.register(
        payload,
        role
      );

      return res.data;
    },

    onSuccess: (data) => {
      const user: User = {
        user_id: data.userId ?? 0,
        full_name: data.username ?? '',
        username: data.username ?? '',
        email: data.email ?? '',
        role: data.role as 'ADMIN' | 'TEACHER',
      };

      // ✅ Lưu vào Zustand + LocalStorage
      setAuth({ user, token: data.token ?? null });

      // ✅ Điều hướng theo role
      switch (data.role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'TEACHER':
          navigate('/dashboard');
          break;
        default:
          navigate('/');
      }
    },

    onError: (error: any) => {
      console.error('Register failed:', error);
    },
  });
};
