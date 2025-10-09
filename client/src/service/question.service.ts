import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { QuestionPayload } from '@/types/question';

export const questionService = {
  async getAll(): Promise<QuestionPayload[]> {
    const res = await http.get<ApiResponse<QuestionPayload[]>>('/questions');

    return res.data.data ?? res.data;
  },

  async getById(id: number): Promise<QuestionPayload> {
    const res = await http.get<ApiResponse<QuestionPayload>>(
      `/questions/${id}`
    );

    return res.data.data ?? res.data;
  },

  async getByLessonId(lessonId: number): Promise<QuestionPayload[]> {
    const res = await http.get<ApiResponse<QuestionPayload[]>>(
      `/questions/lessons/${lessonId}/questions`
    );

    return res.data.data ?? res.data;
  },

  async create(payload: Partial<QuestionPayload>): Promise<QuestionPayload> {
    const res = await http.post<ApiResponse<QuestionPayload>>(
      '/questions',
      payload
    );

    return res.data.data ?? res.data;
  },

  async update(
    id: number,
    payload: Partial<QuestionPayload>
  ): Promise<QuestionPayload> {
    const res = await http.put<ApiResponse<QuestionPayload>>(
      `/questions/${id}`,
      payload
    );

    return res.data.data ?? res.data;
  },

  async delete(id: number): Promise<void> {
    await http.delete(`/questions/${id}`);
  },
};
