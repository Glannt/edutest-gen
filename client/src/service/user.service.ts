import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { PageResponse } from '@/types/page.response';
import { UserPayload } from '@/types/user';

export const userService = {
  /**
   * Lấy danh sách người dùng (hỗ trợ phân trang + sắp xếp)
   */
  async getAll(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'asc' | 'desc';
  }): Promise<PageResponse<UserPayload>> {
    const {
      page = 0,
      size = 10,
      sortBy = 'id',
      direction = 'asc',
    } = params || {};

    const res = await http.get<ApiResponse<PageResponse<UserPayload>>>(
      '/users',
      {
        params: { page, size, sortBy, direction },
      }
    );

    return res.data.data ?? res.data;
  },

  async create(payload: Partial<UserPayload>): Promise<UserPayload> {
    const res = await http.post<ApiResponse<UserPayload>>('/users', payload);

    return res.data.data ?? res.data;
  },

  /**
   * Lấy thông tin người dùng theo ID
   */
  async getById(id: number): Promise<UserPayload> {
    const res = await http.get<ApiResponse<UserPayload>>(`/users/${id}`);

    return res.data.data ?? res.data;
  },

  /**
   * Cập nhật người dùng
   */
  async update(
    id: number,
    payload: Partial<UserPayload>
  ): Promise<UserPayload> {
    const res = await http.put<ApiResponse<UserPayload>>(
      `/users/${id}`,
      payload
    );

    return res.data.data ?? res.data;
  },

  /**
   * Xóa người dùng
   */
  async delete(id: number): Promise<void> {
    await http.delete(`/users/${id}`);
  },
};
