import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { questionService } from '@/service/question.service';
import { QuestionPayload } from '@/types/question';

/**
 * Lấy danh sách tất cả Question
 */
export const useQuestions = () => {
  return useQuery<QuestionPayload[]>({
    queryKey: ['questions'],
    queryFn: () => questionService.getAll(),
  });
};

/**
 * Lấy chi tiết Question theo ID
 */
export const useQuestion = (id?: number) => {
  return useQuery<QuestionPayload>({
    queryKey: ['questions', id],
    queryFn: () => questionService.getById(id!),
    enabled: !!id,
  });
};

/**
 * Hook tạo Question mới
 */
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<QuestionPayload>) =>
      questionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
};

/**
 * Hook cập nhật Question
 */
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<QuestionPayload>;
    }) => questionService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
};

/**
 * Hook xoá Question
 */
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => questionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
};
