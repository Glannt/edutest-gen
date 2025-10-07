import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { lessonService } from '@/service/lesson.service';
import { LessonPayload } from '@/types/lesson';

/**
 * Lấy danh sách tất cả Lesson
 */
export const useLessons = () => {
  return useQuery<LessonPayload[]>({
    queryKey: ['lessons'],
    queryFn: () => lessonService.getAll(),
  });
};

/**
 * Lấy chi tiết Lesson theo ID
 */
export const useLesson = (id?: number) => {
  return useQuery<LessonPayload>({
    queryKey: ['lessons', id],
    queryFn: () => lessonService.getById(id!),
    enabled: !!id,
  });
};

/**
 * Hook tạo Lesson mới
 */
export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<LessonPayload>) =>
      lessonService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
};

/**
 * Hook cập nhật Lesson
 */
export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<LessonPayload>;
    }) => lessonService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
};

/**
 * Hook xoá Lesson
 */
export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => lessonService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
};

/**
 * Hook find Lessons theo chapter id
 */
export const useLessonsByChapter = (chapterId?: number) => {
  return useQuery<LessonPayload[]>({
    queryKey: ['lessons', 'chapter', chapterId],
    queryFn: () => lessonService.getAllByChapter(chapterId!),
    enabled: !!chapterId,
  });
};
