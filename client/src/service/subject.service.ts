import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { SubjectPayload } from '@/types/subject';

export const subjectService = {
  async getAll(): Promise<SubjectPayload[]> {
    const res = await http.get<ApiResponse<SubjectPayload[]>>('/subjects');

    return res.data.data ?? res.data;
  },

  async getById(id: number): Promise<SubjectPayload> {
    const res = await http.get<ApiResponse<SubjectPayload>>(`/subjects/${id}`);

    return res.data.data ?? res.data;
  },

  async create(payload: Partial<SubjectPayload>): Promise<SubjectPayload> {
    const res = await http.post<ApiResponse<SubjectPayload>>(
      '/subjects',
      payload
    );

    return res.data.data ?? res.data;
  },

  async update(
    id: number,
    payload: Partial<SubjectPayload>
  ): Promise<SubjectPayload> {
    const res = await http.put<ApiResponse<SubjectPayload>>(
      `/subjects/${id}`,
      payload
    );

    return res.data.data ?? res.data;
  },

  async delete(id: number): Promise<void> {
    await http.delete(`/subjects/${id}`);
  },

  async searchByName(name: string): Promise<SubjectPayload[]> {
    const res = await http.get<ApiResponse<SubjectPayload[]>>(
      `/subjects/search?name=${encodeURIComponent(name)}`
    );

    return res.data.data ?? res.data;
  },
};
