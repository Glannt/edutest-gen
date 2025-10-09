// src/hooks/useMatrix.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';

import { MatrixRequest, MatrixResponse } from '@/types/matrix';
import { matrixService } from '@/service/matrix.service';
import { PageResponse } from '@/types/page.response';

export const useMatrices = (page: number = 0, pageSize: number = 10) => {
  return useQuery<PageResponse<MatrixResponse>>({
    queryKey: ['matrices', page, pageSize],
    queryFn: async () => {
      // Chỉ gọi endpoint phân trang
      const res = await matrixService.getAll({ page, size: pageSize });

      // Ép kiểu an toàn
      if ('content' in res) return res as PageResponse<MatrixResponse>;

      // fallback nếu backend trả nhầm
      return {
        content: Array.isArray(res) ? res : [],
        totalElements: Array.isArray(res) ? res.length : 0,
        totalPages: 1,
        pageNumber: page,
        pageSize,
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // 1 phút
  });
};

export const useMatrix = (id?: number) => {
  return useQuery<MatrixResponse>({
    queryKey: ['matrix', id],
    queryFn: () => matrixService.getById(id!),
    enabled: !!id,
  });
};

export const useCreateMatrix = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: MatrixRequest) => matrixService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['matrices'] }),
  });
};

export const useUpdateMatrix = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MatrixRequest }) =>
      matrixService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['matrices'] }),
  });
};

export const useDeleteMatrix = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => matrixService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['matrices'] }),
  });
};
