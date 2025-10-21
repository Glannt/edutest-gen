import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { LevelPayload } from '@/types/level';
import { PageResponse } from '@/types/page.response';

export const levelService = {
  async getAll(): Promise<LevelPayload[]> {
    const res = await http.get<ApiResponse<LevelPayload[]>>('/levels');

    return res.data.data ?? res.data; // tuỳ theo structure của @RestResponse
  },
  async getPaged(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'asc' | 'desc';
  }): Promise<PageResponse<LevelPayload>> {
    const {
      page = 0,
      size = 10,
      sortBy = 'id',
      direction = 'asc',
    } = params || {};

    const res = await http.get<ApiResponse<PageResponse<LevelPayload>>>(
      '/levels/paged',
      {
        params: { page, size, sortBy, direction },
      }
    );

    return res.data.data ?? res.data;
  },

  async getById(id: number): Promise<LevelPayload> {
    const res = await http.get<ApiResponse<LevelPayload>>(`/levels/${id}`);

    return res.data.data ?? res.data;
  },

  async create(payload: Partial<LevelPayload>): Promise<LevelPayload> {
    const res = await http.post<ApiResponse<LevelPayload>>('/levels', payload);

    return res.data.data ?? res.data;
  },

  async update(
    id: number,
    payload: Partial<LevelPayload>
  ): Promise<LevelPayload> {
    const res = await http.put<ApiResponse<LevelPayload>>(
      `/levels/${id}`,
      payload
    );

    return res.data.data ?? res.data;
  },

  async delete(id: number): Promise<void> {
    await http.delete(`/levels/${id}`);
  },
};
