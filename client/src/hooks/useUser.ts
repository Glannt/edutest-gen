import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  keepPreviousData,
} from '@tanstack/react-query';

import { userService } from '@/service/user.service';
import { UserPayload } from '@/types/user';
import { PageResponse } from '@/types/page.response';

/**
 * Hook: Lấy danh sách người dùng (phân trang + sort)
 */
export const usePagedUsers = (params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}) =>
  useQuery<PageResponse<UserPayload>>({
    queryKey: ['users', params],
    queryFn: () => userService.getAll(params),
    placeholderData: keepPreviousData,
  });

/**
 * Hook: Lấy thông tin người dùng theo ID
 */
export const useUser = (id?: number) =>
  useQuery<UserPayload>({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id!),
    enabled: !!id, // chỉ gọi API khi id hợp lệ
  });

/**
 * Hook tạo mới user
 */
export const useCreateUser = (): UseMutationResult<
  UserPayload,
  Error,
  Partial<UserPayload>,
  unknown
> => {
  const qc = useQueryClient();

  return useMutation<UserPayload, Error, Partial<UserPayload>>({
    mutationFn: (payload) => userService.create(payload),
    onSuccess: () => {
      // Refresh lại danh sách users
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

/**
 * Hook: Cập nhật thông tin người dùng
 */
export const useUpdateUser = (): UseMutationResult<
  UserPayload,
  Error,
  { id: number; payload: Partial<UserPayload> },
  unknown
> => {
  const qc = useQueryClient();

  return useMutation<
    UserPayload,
    Error,
    { id: number; payload: Partial<UserPayload> }
  >({
    mutationFn: ({ id, payload }) => userService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

/**
 * Hook: Xóa người dùng
 */
export const useDeleteUser = (): UseMutationResult<
  void,
  Error,
  number,
  unknown
> => {
  const qc = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
