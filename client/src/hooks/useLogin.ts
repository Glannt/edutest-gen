import type { AuthResponseData, LoginPayload } from '@/types/auth';
import type { User } from '@/types/user';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { addToast } from '@heroui/react';

import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/service/auth.service';

type JwtDecoded = {
  exp?: number;
  [key: string]: any;
};

/**
 * ✅ Hook đăng nhập: gọi API, lưu user + token vào Zustand, và chuyển hướng.
 * - Tự decode JWT để lấy `exp`
 * - Typed đầy đủ
 * - Có onError gọn gàng
 */
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginPayload): Promise<AuthResponseData> => {
      const res = await authService.login(payload);

      return res.data;
    },

    onSuccess: (data) => {
      if (!data?.token) {
        // console.error('Login failed: missing token');
        addToast({
          title: 'Đăng nhập thất bại',
          color: 'danger',
          timeout: 2000,
        });

        return;
      }

      // Decode JWT để lấy exp (nếu có)
      let tokenExp: number | undefined;

      try {
        const decoded = jwtDecode<JwtDecoded>(data.token);

        tokenExp = decoded.exp;
      } catch (err) {
        console.warn('Token decode failed:', err);
      }

      // Chuẩn hóa dữ liệu user
      const user: User = {
        user_id: data.userId ?? 0,
        full_name: data.full_name ?? data.username ?? '',
        username: data.username ?? '',
        email: data.email ?? '',
        role: (data.role as 'ADMIN' | 'TEACHER') ?? 'TEACHER',
      };

      // Lưu vào Zustand (auth store)
      setAuth({
        user,
        token: data.token,
        tokenExp,
      });

      // Điều hướng về trang chủ hoặc dashboard
      navigate('/', { replace: true });
    },

    onError: (error: unknown) => {
      // console.error('❌ Login failed:', error);
      addToast({
        title: 'Đăng nhập thất bại',
        color: 'danger',
        timeout: 2000,
      });
      const message =
        error instanceof Error
          ? error.message
          : 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin.';

      alert(message);
    },
  });
};
