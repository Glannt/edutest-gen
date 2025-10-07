// src/service/chapter.service.ts
import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { ChapterPayload } from '@/types/chapter';

export const chapterService = {
  async getAll(): Promise<ChapterPayload[]> {
    const res = await http.get<ApiResponse<ChapterPayload[]>>('/chapters');

    return res.data.data ?? res.data;
  },

  async getById(id: number): Promise<ChapterPayload> {
    const res = await http.get<ApiResponse<ChapterPayload>>(`/chapters/${id}`);

    return res.data.data ?? res.data;
  },

  async create(payload: Partial<ChapterPayload>): Promise<ChapterPayload> {
    const res = await http.post<ApiResponse<ChapterPayload>>(
      '/chapters',
      payload
    );

    return res.data.data ?? res.data;
  },

  async update(
    id: number,
    payload: Partial<ChapterPayload>
  ): Promise<ChapterPayload> {
    const res = await http.put<ApiResponse<ChapterPayload>>('/chapters', {
      id,
      ...payload,
    });

    return res.data.data ?? res.data;
  },

  async delete(id: number): Promise<void> {
    await http.delete(`/chapters/${id}`);
  },
};
