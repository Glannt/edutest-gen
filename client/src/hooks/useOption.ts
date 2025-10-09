import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { optionService } from '@/service/option.service';
import { OptionPayload } from '@/types/option';

/**
 * Lấy danh sách tất cả Option
 */
export const useOptions = () => {
  return useQuery<OptionPayload[]>({
    queryKey: ['options'],
    queryFn: () => optionService.getAll(),
  });
};

/**
 * Lấy thông tin chi tiết một Option theo ID
 */
export const useOption = (id?: number) => {
  return useQuery<OptionPayload>({
    queryKey: ['options', id],
    queryFn: () => optionService.getById(id!),
    enabled: !!id,
  });
};

/**
 * Hook tạo Option mới
 */
export const useCreateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<OptionPayload>) =>
      optionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options'] });
    },
  });
};

/**
 * Hook cập nhật Option
 */
export const useUpdateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<OptionPayload>;
    }) => optionService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options'] });
    },
  });
};

/**
 * Hook xoá Option
 */
export const useDeleteOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => optionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options'] });
    },
  });
};
