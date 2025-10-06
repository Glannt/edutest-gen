// // src/hooks/useQuestionType.ts
// import { useState } from 'react';

// import {
//   useQuestionTypes,
//   useCreateQuestionType,
//   useUpdateQuestionType,
//   useDeleteQuestionType,
// } from '@/store/useQuestionTypeStore';
// import { QuestionTypePayload } from '@/types/question-type';

// export const useQuestionType = () => {
//   const { data: questionTypes = [], isLoading } = useQuestionTypes();
//   const createMutation = useCreateQuestionType();
//   const updateMutation = useUpdateQuestionType();
//   const deleteMutation = useDeleteQuestionType();

//   const [selectedQuestionType, setSelectedQuestionType] =
//     useState<QuestionTypePayload | null>(null);

//   const handleCreate = async (payload: Partial<QuestionTypePayload>) => {
//     await createMutation.mutateAsync(payload);
//   };

//   const handleUpdate = async (
//     id: number,
//     payload: Partial<QuestionTypePayload>
//   ) => {
//     await updateMutation.mutateAsync({ id, payload });
//   };

//   const handleDelete = async (id: number) => {
//     if (confirm('Bạn có chắc muốn xóa loại câu hỏi này?')) {
//       await deleteMutation.mutateAsync(id);
//     }
//   };

//   return {
//     questionTypes,
//     isLoading,
//     selectedQuestionType,
//     setSelectedQuestionType,
//     handleCreate,
//     handleUpdate,
//     handleDelete,
//   };
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { questionTypeService } from '@/service/question-type.service';
import { QuestionTypePayload } from '@/types/question-type';

/**
 * Lấy danh sách tất cả QuestionType
 */
export const useQuestionTypes = () => {
  return useQuery<QuestionTypePayload[]>({
    queryKey: ['question-types'],
    queryFn: () => questionTypeService.getAll(),
  });
};

/**
 * Lấy thông tin chi tiết một QuestionType theo ID
 */
export const useQuestionType = (id?: number) => {
  return useQuery<QuestionTypePayload>({
    queryKey: ['question-types', id],
    queryFn: () => questionTypeService.getById(id!),
    enabled: !!id,
  });
};

/**
 * Hook tạo QuestionType mới
 */
export const useCreateQuestionType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<QuestionTypePayload>) =>
      questionTypeService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-types'] });
    },
  });
};

/**
 * Hook cập nhật QuestionType
 */
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
  });
};

/**
 * Hook xoá QuestionType
 */
export const useDeleteQuestionType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => questionTypeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-types'] });
    },
  });
};
