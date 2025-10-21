import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';

import { gradeService } from '@/service/grade.service';
import { GradePayload } from '@/types/grade';
import { PageResponse } from '@/types/page.response';

/**
 * Hook: Lấy danh sách người dùng (phân trang + sort)
 */
export const usePagedGrades = (params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}) =>
  useQuery<PageResponse<GradePayload>>({
    queryKey: ['grades', params],
    queryFn: () => gradeService.getPaged(params),
    placeholderData: keepPreviousData,
  });

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
