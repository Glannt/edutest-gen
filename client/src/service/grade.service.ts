import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { GradePayload } from '@/types/grade';

export const gradeService = {
  async getAll(): Promise<GradePayload[]> {
    const res = await http.get<ApiResponse<GradePayload[]>>('/grades');

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
