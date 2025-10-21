import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { GradePayload } from '@/types/grade';
import { PageResponse } from '@/types/page.response';

export const gradeService = {
  async getAll(): Promise<GradePayload[]> {
    const res = await http.get<ApiResponse<GradePayload[]>>('/grades');

    return res.data.data ?? res.data;
  },

  async getPaged(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'asc' | 'desc';
  }): Promise<PageResponse<GradePayload>> {
    const {
      page = 0,
      size = 10,
      sortBy = 'id',
      direction = 'asc',
    } = params || {};

    const res = await http.get<ApiResponse<PageResponse<GradePayload>>>(
      '/grades/paged',
      {
        params: { page, size, sortBy, direction },
      }
    );

    return res.data.data ?? res.data;
  },

  async getById(id: number): Promise<GradePayload> {
    const res = await http.get<ApiResponse<GradePayload>>(`/grades/${id}`);

    return res.data.data ?? res.data;
  },

  async create(payload: Partial<GradePayload>): Promise<GradePayload> {
    const res = await http.post<ApiResponse<GradePayload>>('/grades', payload);

    return res.data.data ?? res.data;
  },

  async update(
    id: number,
    payload: Partial<GradePayload>
  ): Promise<GradePayload> {
    const res = await http.put<ApiResponse<GradePayload>>(
      `/grades/${id}`,
      payload
    );

    return res.data.data ?? res.data;
  },

  async delete(id: number): Promise<void> {
    await http.delete(`/grades/${id}`);
  },
};
