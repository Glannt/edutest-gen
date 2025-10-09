import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';

type ProtectedRouteProps = {
  allowedRoles?: string[];
  children: React.ReactNode;
};

/**
 * Route bảo vệ - kiểm tra quyền truy cập dựa vào role.
 * @param allowedRoles danh sách role được phép (VD: ['TEACHER', 'ADMIN'])
 */

export const ProtectedRoute = ({
  allowedRoles = [],
  children,
}: ProtectedRouteProps) => {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return (
      <Navigate
        replace
        to='/login'
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        replace
        to='/unauthorized'
      />
    );
  }

  return <>{children}</>;
};
