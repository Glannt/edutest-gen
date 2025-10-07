// src/hooks/useChapter.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { chapterService } from '@/service/chapter.service';
import { ChapterPayload } from '@/types/chapter';

/**
 * Lấy danh sách tất cả chapter
 */
export const useChapters = () => {
  return useQuery<ChapterPayload[]>({
    queryKey: ['chapters'],
    queryFn: () => chapterService.getAll(),
  });
};

/**
 * Lấy thông tin chi tiết một chapter theo ID
 */
export const useChapter = (id?: number) => {
  return useQuery<ChapterPayload>({
    queryKey: ['chapters', id],
    queryFn: () => chapterService.getById(id!),
    enabled: !!id,
  });
};

/**
 * Hook tạo chapter mới
 */
export const useCreateChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<ChapterPayload>) =>
      chapterService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
    },
  });
};

/**
 * Hook cập nhật chapter
 */
export const useUpdateChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<ChapterPayload>;
    }) => chapterService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
    },
  });
};

/**
 * Hook xoá chapter
 */
export const useDeleteChapter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => chapterService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
    },
  });
};
