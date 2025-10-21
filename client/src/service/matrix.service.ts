// src/services/matrix.service.ts
import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { MatrixRequest, MatrixResponse } from '@/types/matrix';
import { PageResponse } from '@/types/page.response';
interface GetAllMatricesParams {
  page?: number; // 0-based
  size?: number; // số item mỗi trang
}
export const matrixService = {
  getAll: async (
    params?: GetAllMatricesParams
  ): Promise<PageResponse<MatrixResponse> | MatrixResponse[]> => {
    if (params == null || params == undefined) {
      const res =
        await http.get<ApiResponse<MatrixResponse[]>>('/matrices/all');

      // Nếu backend wrap thêm data, unwrap
      return res.data?.data ?? res.data;
    }
    const res = await http.get<ApiResponse<PageResponse<MatrixResponse>>>(
      '/matrices',
      {
        params,
      }
    );

    // Nếu backend wrap thêm data, unwrap
    return res.data?.data ?? res.data;
  },

  getById: async (id: number): Promise<MatrixResponse> => {
    const res = await http.get<ApiResponse<MatrixResponse>>(`/matrices/${id}`);

    return res.data.data ?? res.data;
  },

  create: async (payload: MatrixRequest): Promise<MatrixResponse> => {
    const res = await http.post<ApiResponse<MatrixResponse>>(
      '/matrices',
      payload
    );

    return res.data.data ?? res.data;
  },

  update: async (
    id: number,
    payload: MatrixRequest
  ): Promise<MatrixResponse> => {
    const res = await http.put<ApiResponse<MatrixResponse>>(
      `/matrices/${id}`,
      payload
    );

    return res.data.data ?? res.data;
  },

  delete: async (id: number): Promise<void> => {
    await http.delete<ApiResponse<MatrixResponse>>(`/matrices/${id}`);
  },

  /** ✅ Xuất 1 ma trận (Excel .xlsx) */
  exportSingle: async (matrixId: number): Promise<Blob> => {
    const res = await http.get(`/matrices/export/${matrixId}`, {
      responseType: 'blob',
    });

    return res.data;
  },

  /** ✅ Xuất nhiều ma trận (ZIP) */
  exportMultiple: async (matrixIds: number[]): Promise<Blob> => {
    const res = await http.post(`/matrices/export/multiple`, matrixIds, {
      responseType: 'blob',
    });

    return res.data;
  },
};
