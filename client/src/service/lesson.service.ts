import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { LessonPayload } from '@/types/lesson';

export const lessonService = {
  async getAll(): Promise<LessonPayload[]> {
    const res = await http.get<ApiResponse<LessonPayload[]>>('/lessons');

    return res.data.data ?? res.data;
  },

  async getAllByChapter(chapterId: number): Promise<LessonPayload[]> {
    const res = await http.get(`/lessons/chapters/${chapterId}/lessons`);

    return res.data.data ?? res.data;
  },

  async getById(id: number): Promise<LessonPayload> {
    const res = await http.get<ApiResponse<LessonPayload>>(`/lessons/${id}`);

    return res.data.data ?? res.data;
  },

  async create(payload: Partial<LessonPayload>): Promise<LessonPayload> {
    const res = await http.post<ApiResponse<LessonPayload>>(
      '/lessons',
      payload
    );

    return res.data.data ?? res.data;
  },

  async update(
    id: number,
    payload: Partial<LessonPayload>
  ): Promise<LessonPayload> {
    const res = await http.put<ApiResponse<LessonPayload>>(
      `/lessons/${id}`,
      payload
    );

    return res.data.data ?? res.data;
  },

  async delete(id: number): Promise<void> {
    await http.delete(`/lessons/${id}`);
  },
};
