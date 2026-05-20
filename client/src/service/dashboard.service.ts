// services/dashboardService.ts
import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { DashboardMetricsDTO } from '@/types/dashboard';
import { DashBoardConfig } from '@/types/dashboard.config';

export const dashboardService = {
  getMetrics: async (): Promise<ApiResponse<DashboardMetricsDTO>> => {
    const res = await http.get('/admin/dashboard/metrics');

    return res.data;
  },

  getAll: async (): Promise<ApiResponse<DashBoardConfig[]>> => {
    const res = await http.get('/admin/dashboard/configs');

    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<DashBoardConfig>> => {
    const res = await http.get(`/admin/dashboard/configs/${id}`);

    return res.data;
  },

  create: async (
    data: DashBoardConfig
  ): Promise<ApiResponse<DashBoardConfig>> => {
    const res = await http.post('/admin/dashboard/configs', data);

    return res.data;
  },

  update: async (
    id: string,
    data: DashBoardConfig
  ): Promise<ApiResponse<DashBoardConfig>> => {
    const res = await http.put(`/admin/dashboard/configs/${id}`, data);

    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const res = await http.delete(`/admin/dashboard/configs/${id}`);

    return res.data;
  },
};
