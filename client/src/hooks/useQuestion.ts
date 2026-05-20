import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from '@tanstack/react-query';

import { questionService } from '@/service/question.service';
import { QuestionPayload } from '@/types/question';
import { VietjackRequest } from '@/interface/ai.request.interface';

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
/** Fetch question theo lessonId */
export const fetchQuestionsByLesson = (lessonId: number) =>
  questionService.getByLessonId(lessonId);
export const useQuestionsByLesson = (lessonId?: number) => {
  return useQuery<QuestionPayload[]>({
    queryKey: ['questions', 'lesson', lessonId],
    queryFn: () => fetchQuestionsByLesson(lessonId!), // gọi API riêng
    enabled: !!lessonId,
  });
};

export const useQuestionsByMatrix = (lessonIds: number[] = []) => {
  const queries = useQueries({
    queries: lessonIds.map((lessonId) => ({
      queryKey: ['questions', 'lesson', lessonId],
      queryFn: () => fetchQuestionsByLesson(lessonId!), // gọi API trực tiếp, không dùng hook
      enabled: !!lessonId,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const data = queries.flatMap((q) => q.data ?? []);

  return { data, isLoading };
};

export const useQuestionsFromN8n = (filters: VietjackRequest) => {
  return useQuery<QuestionPayload[]>({
    queryKey: ['questions', 'n8n', filters],
    queryFn: () => questionService.searchN8n(filters),
    // enabled: Object.values(filters).some((v) => !!v), // chỉ fetch khi có ít nhất 1 filter
    enabled: false, // ❌ Không auto gọi khi filters thay đổi
    retry: false,
  });
};
