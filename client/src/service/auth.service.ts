import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { AuthResponseData, LoginPayload } from '@/types/auth';
import {
  UpdatePasswordRequest,
  UpdateProfileRequest,
  User,
} from '@/types/user';

export interface RegisterPayload {
  full_name: string;
  username: string;
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  raw_token: string;
  password: string;
  confirm_password: string;
}

/**
 * Note:
 * - /auth/login expects { identifier, password }
 * - /auth/register expects payload with full_name, email, password, phone_number, role
 * - on success we persist access_token to localStorage under 'accessToken'
 */
export const authService = {
  register: async (
    payload: RegisterPayload,
    role: 'ADMIN' | 'TEACHER' = 'TEACHER'
  ): Promise<ApiResponse<AuthResponseData>> => {
    const res = await http.post('/auth/register', {
      ...payload,
      role,
    });

    return res.data;
  },

  login: async (
    payload: LoginPayload
  ): Promise<ApiResponse<AuthResponseData>> => {
    // API expects identifier (email or username) + password
    const body = {
      username: payload.username,
      password: payload.password,
    };

    const res = await http.post('/auth/login', body);

    return res.data;
  },
  forgotPassword: async (email: string): Promise<ApiResponse<any>> => {
    const res = await http.post('/auth/reset-pass', { email });

    return res.data;
  },
  resetPassword: async (
    payload: ResetPasswordPayload
  ): Promise<ApiResponse<any>> => {
    const res = await http.post('/auth/new-pass', payload);

    return res.data;
  },
  getProfile: async (): Promise<ApiResponse<User>> => {
    const res = await http.get('/auth/me');

    return res.data;
  },
  logout: async (): Promise<ApiResponse<any>> => {
    const res = await http.post('/auth/logout');

    return res.data;
  },
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<ApiResponse<User>> => {
    const res = await http.put('/auth/profile', data);

    return res.data;
  },
  updatePassword: async (
    data: UpdatePasswordRequest
  ): Promise<ApiResponse<void>> => {
    const res = await http.put('/auth/password', data);

    return res.data;
  },
};
