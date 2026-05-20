import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  keepPreviousData,
} from '@tanstack/react-query';
import { addToast } from '@heroui/react';

import { userService } from '@/service/user.service';
import {
  UpdatePasswordRequest,
  UpdateProfileRequest,
  UserPayload,
} from '@/types/user';
import { PageResponse } from '@/types/page.response';
import { authService } from '@/service/auth.service';

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

export const useProfile = () => {
  const queryClient = useQueryClient();

  // Lấy thông tin user hiện tại
  const {
    data: profile,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    select: (res) => res.data, // chỉ lấy data bên trong ApiResponse
  });

  // Cập nhật profile
  const updateProfile = useMutation({
    mutationFn: (data: UpdateProfileRequest) => authService.updateProfile(data),
    onSuccess: (res) => {
      addToast({
        title: 'Cập nhật thành công',
        description: 'Thông tin cá nhân đã được cập nhật.',
        color: 'success',
      });

      // invalidate cache để getProfile fetch lại
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err: any) => {
      addToast({
        title: 'Lỗi cập nhật',
        description:
          err?.response?.data?.message || 'Không thể cập nhật thông tin.',
        color: 'danger',
      });
    },
  });

  return {
    profile,
    isLoading,
    isFetching,
    updateProfile,
  };
};

export const useChangePassword = () => {
  const mutation = useMutation({
    mutationFn: (data: UpdatePasswordRequest) =>
      authService.updatePassword(data),
    onSuccess: () => {
      addToast({
        title: 'Thành công',
        description: 'Mật khẩu đã được thay đổi.',
        color: 'success',
      });
    },
    onError: (err: any) => {
      addToast({
        title: 'Lỗi cập nhật mật khẩu',
        description:
          err?.response?.data?.message || 'Không thể thay đổi mật khẩu.',
        color: 'danger',
      });
    },
  });

  return mutation;
};
