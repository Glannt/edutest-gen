import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { subjectService } from '@/service/subject.service';
import { SubjectPayload } from '@/types/subject';

/**
 * Lấy danh sách tất cả Subject
 */
export const useSubjects = () => {
  return useQuery<SubjectPayload[]>({
    queryKey: ['subjects'],
    queryFn: () => subjectService.getAll(),
  });
};

/**
 * Lấy thông tin chi tiết một Subject theo ID
 */
export const useSubject = (id?: number) => {
  return useQuery<SubjectPayload>({
    queryKey: ['subjects', id],
    queryFn: () => subjectService.getById(id!),
    enabled: !!id,
  });
};

/**
 * Tìm kiếm môn học theo tên
 */
export const useSearchSubjects = (name: string) => {
  return useQuery<SubjectPayload[]>({
    queryKey: ['subjects', 'search', name],
    queryFn: () => subjectService.searchByName(name),
    enabled: !!name,
  });
};

/**
 * Tạo mới Subject
 */
export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<SubjectPayload>) =>
      subjectService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
    onError: () => {
      alert('Tạo subject lỗi');
    },
  });
};

/**
 * Cập nhật Subject
 */
export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<SubjectPayload>;
    }) => subjectService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

/**
 * Xoá Subject
 */
export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};
