import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/service/auth.service';
import { AuthResponseData, LoginPayload } from '@/types/auth';
import { User } from '@/types/user';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginPayload): Promise<AuthResponseData> => {
      const res = await authService.login(payload);

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

      setAuth({ user, token: data.token ?? null });
      navigate('/');
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });
};
