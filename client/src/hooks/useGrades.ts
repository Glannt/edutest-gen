import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { gradeService } from '@/service/grade.service';
import { GradePayload } from '@/types/grade';

/**
 * Lấy danh sách tất cả Grade
 */
export const useGrades = () => {
  return useQuery<GradePayload[]>({
    queryKey: ['grades'],
    queryFn: () => gradeService.getAll(),
  });
};

/**
 * Lấy thông tin chi tiết một Grade theo ID
 */
export const useGrade = (id?: number) => {
  return useQuery<GradePayload>({
    queryKey: ['grades', id],
    queryFn: () => gradeService.getById(id!),
    enabled: !!id,
  });
};

/**
 * Hook tạo Grade mới
 */
export const useCreateGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<GradePayload>) =>
      gradeService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });
};

/**
 * Hook cập nhật Grade
 */
export const useUpdateGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<GradePayload>;
    }) => gradeService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });
};

/**
 * Hook xoá Grade
 */
export const useDeleteGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => gradeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });
};
