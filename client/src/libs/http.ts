/**
 * Node modules
 */
import axios, { type CreateAxiosDefaults } from 'axios';

import { useAuthStore } from '@/store/auth.store';

/**
 * Stores
 */

const options: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_URL,
};

const http = axios.create(options);

http.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().token;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      useAuthStore.getState().clearAuth(); // Xóa thông tin user, logout
    }

    return Promise.reject(error); // Trả về lỗi cho component xử lý
  }
);

export default http;
