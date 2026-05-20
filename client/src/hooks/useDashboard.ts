import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { dashboardService } from '@/service/dashboard.service';
import { DashboardMetricsDTO } from '@/types/dashboard';
import { DashBoardConfig } from '@/types/dashboard.config';

export const useDashboard = () => {
  return useQuery<DashboardMetricsDTO>({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      const response = await dashboardService.getMetrics();

      return response.data; // <-- unwrap the actual DTO
    },
  });
};

// 🟢 Lấy danh sách tất cả config
export const useDashboardConfigs = () => {
  return useQuery({
    queryKey: ['dashboardConfigs'],
    queryFn: async () => {
      const response = await dashboardService.getAll();

      return response.data;
    },
  });
};

// 🟡 Lấy chi tiết 1 config
export const useDashboardConfig = (id: string) => {
  return useQuery({
    queryKey: ['dashboardConfig', id],
    queryFn: async () => {
      const response = await dashboardService.getById(id);

      return response.data;
    },
    enabled: !!id,
  });
};

// 🔵 Tạo mới config
export const useCreateDashboardConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dashboardService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardConfigs'] });
    },
  });
};

// 🟠 Cập nhật config
export const useUpdateDashboardConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: DashBoardConfig }) =>
      dashboardService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardConfigs'] });
    },
  });
};

// 🔴 Xóa config
export const useDeleteDashboardConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dashboardService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardConfigs'] });
    },
  });
};
