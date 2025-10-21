import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { PageResponse } from '@/types/page.response';
import { QuestionTypePayload } from '@/types/question-type';

export const questionTypeService = {
  getAll: async (): Promise<QuestionTypePayload[]> => {
    const res =
      await http.get<ApiResponse<QuestionTypePayload[]>>('/question-types');

    return res.data.data;
  },

  async getPaged(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'asc' | 'desc';
  }): Promise<PageResponse<QuestionTypePayload>> {
    const {
      page = 0,
      size = 10,
      sortBy = 'id',
      direction = 'asc',
    } = params || {};

    const res = await http.get<ApiResponse<PageResponse<QuestionTypePayload>>>(
      '/question-types/paged',
      {
        params: { page, size, sortBy, direction },
      }
    );

    return res.data.data ?? res.data;
  },

  getById: async (id: number): Promise<QuestionTypePayload> => {
    const res = await http.get<ApiResponse<QuestionTypePayload>>(
      `/question-types/${id}`
    );

    return res.data.data;
  },

  create: async (
    payload: Partial<QuestionTypePayload>
  ): Promise<QuestionTypePayload> => {
    const res = await http.post<ApiResponse<QuestionTypePayload>>(
      '/question-types',
      payload
    );

    return res.data.data;
  },

  update: async (
    id: number,
    payload: Partial<QuestionTypePayload>
  ): Promise<QuestionTypePayload> => {
    const res = await http.put<ApiResponse<QuestionTypePayload>>(
      `/question-types/${id}`,
      payload
    );

    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/question-types/${id}`);
  },
};
