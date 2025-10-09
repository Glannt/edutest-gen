import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import {
  ExamResponse,
  CreateExamRequest,
  AutoGenerateExamRequest,
  AutoGenerateExamListRequest,
} from '@/types/exam';
import { PageResponse } from '@/types/page.response';

export const examService = {
  getAll: async (): Promise<PageResponse<ExamResponse>> => {
    const res =
      await http.get<ApiResponse<PageResponse<ExamResponse>>>('/exams');

    return res.data.data ?? res.data;
  },

  getPaged: async (
    page = 0,
    size = 10
  ): Promise<PageResponse<ExamResponse>> => {
    const res = await http.get<ApiResponse<PageResponse<ExamResponse>>>(
      `/exams?page=${page}&size=${size}`
    );

    return res.data.data ?? res.data;
  },

  getById: async (id: number): Promise<ExamResponse> => {
    const res = await http.get<ApiResponse<ExamResponse>>(`/exams/${id}`);

    return res.data.data ?? res.data;
  },

  create: async (payload: CreateExamRequest): Promise<ExamResponse> => {
    const res = await http.post<ApiResponse<ExamResponse>>(`/exams`, payload);

    return res.data.data ?? res.data;
  },

  update: async (
    id: number,
    payload: CreateExamRequest
  ): Promise<ExamResponse> => {
    const res = await http.put<ApiResponse<ExamResponse>>(
      `/exams/${id}`,
      payload
    );

    return res.data.data ?? res.data;
  },

  delete: async (id: number): Promise<void> => {
    await http.delete<ApiResponse<ExamResponse>>(`/exams/${id}`);
  },

  autoGenerate: async (
    payload: AutoGenerateExamRequest
  ): Promise<ExamResponse> => {
    const res = await http.post<ApiResponse<ExamResponse>>(
      `/exams/auto-generate`,
      payload
    );

    return res.data.data ?? res.data;
  },

  autoGenerateList: async (
    payload: AutoGenerateExamListRequest
  ): Promise<ExamResponse[]> => {
    const res = await http.post<ApiResponse<ExamResponse[]>>(
      `/exams/auto-generates`,
      payload
    );

    return res.data.data ?? res.data;
  },

  exportSingle: async (examId: number, format: 'word' | 'pdf' = 'word') => {
    const res = await http.get(`/exams/${examId}/export?format=${format}`, {
      responseType: 'blob',
    });

    return res.data; // Blob
  },

  exportMultiple: async (
    examIds: number[],
    format: 'word' | 'pdf' = 'word'
  ) => {
    const res = await http.post(
      `/exams/export-multiple?format=${format}`,
      examIds
    );

    return res.data as string[]; // danh sách file URL/paths
  },

  importFile: async (file: File) => {
    const formData = new FormData();

    formData.append('file', file);
    const res = await http.post(`/exams/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data as string;
  },
};
