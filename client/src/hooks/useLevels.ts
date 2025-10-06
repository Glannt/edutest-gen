import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { levelService } from '@/service/level.service';
import { LevelPayload } from '@/types/level';

/**
 * Lấy danh sách tất cả Level
 */
export const useLevels = () => {
  return useQuery<LevelPayload[]>({
    queryKey: ['levels'],
    queryFn: () => levelService.getAll(),
  });
};

/**
 * Lấy thông tin chi tiết một Level theo ID
 */
export const useLevel = (id?: number) => {
  return useQuery<LevelPayload>({
    queryKey: ['levels', id],
    queryFn: () => levelService.getById(id!),
    enabled: !!id, // chỉ chạy khi có id
  });
};

/**
 * Hook tạo Level mới
 */
export const useCreateLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<LevelPayload>) =>
      levelService.create(payload),
    onSuccess: () => {
      // Tự động refetch danh sách
      queryClient.invalidateQueries({ queryKey: ['levels'] });
    },
  });
};

/**
 * Hook cập nhật Level
 */
export const useUpdateLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<LevelPayload>;
    }) => levelService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
    },
  });
};

/**
 * Hook xoá Level
 */
export const useDeleteLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => levelService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
    },
  });
};
