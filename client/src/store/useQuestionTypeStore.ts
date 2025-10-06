// src/store/useQuestionTypeStore.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { questionTypeService } from '@/service/question-type.service';
import { QuestionTypePayload } from '@/types/question-type';

// --- Lấy tất cả question types ---
export const useQuestionTypes = () => {
  return useQuery<QuestionTypePayload[]>({
    queryKey: ['question-types'],
    queryFn: questionTypeService.getAll,
  });
};

// --- Lấy 1 question type theo id ---
export const useQuestionType = (id: number) => {
  return useQuery<QuestionTypePayload>({
    queryKey: ['question-type', id],
    queryFn: () => questionTypeService.getById(id),
    enabled: !!id,
  });
};

// --- Tạo mới ---
export const useCreateQuestionType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<QuestionTypePayload>) =>
      questionTypeService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-types'] });
    },
    onError: () => {
      alert('Tạo question type thất bại');
    },
  });
};

// --- Cập nhật ---
export const useUpdateQuestionType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<QuestionTypePayload>;
    }) => questionTypeService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-types'] });
    },
    onError: () => {
      alert('Cập nhật question type thất bại');
    },
  });
};

// --- Xóa ---
export const useDeleteQuestionType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => questionTypeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-types'] });
    },
    onError: () => {
      alert('Xóa question type thất bại');
    },
  });
};
