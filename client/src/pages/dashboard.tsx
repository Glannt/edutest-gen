import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

import { useDashboard } from '@/hooks/useDashboard';
import { useAuthStore } from '@/store/auth.store';
import { adminActions, commonActions } from '@/constant/adminAction';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: dashboardMetrics, isLoading, error } = useDashboard();

  // Map màu sắc (Tailwind-safe)
  const colorMap: Record<string, string> = {
    primary: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
    secondary: 'bg-purple-100 hover:bg-purple-200 text-purple-700',
    success: 'bg-green-100 hover:bg-green-200 text-green-700',
    warning: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700',
    danger: 'bg-red-100 hover:bg-red-200 text-red-700',
    info: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700',
  };

  // Chọn danh sách action theo role
  const actions = user?.role === 'ADMIN' ? adminActions : commonActions;

  const labelMap: Record<string, string> = {
    teachers: 'Giáo viên',
    students: 'Học sinh',
    activeAccounts: 'Tài khoản hoạt động',
    lockedAccounts: 'Tài khoản bị khóa',
    onlineUsers: 'Người dùng đang online',
  };

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <p>
        Chào mừng <strong>{user?.full_name || user?.username}</strong> đến với
        bảng điều khiển.
      </p>

      {/* 🟦 Key Metrics */}
      {dashboardMetrics && user?.role == 'ADMIN' && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6'>
          {Object.entries(dashboardMetrics.keyMetrics).map(([key, value]) => (
            <div
              key={key}
              className='p-6 bg-white shadow-md rounded-xl flex flex-col items-center justify-center'
            >
              <p className='text-sm font-medium text-gray-500'>
                {labelMap[key] || key}
              </p>
              <p className='text-3xl font-bold'>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* 🟧 Actions */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {actions.map(({ title, path, color, icon }) => (
          <Link
            key={path}
            className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-sm ${colorMap[color]} transition`}
            to={path}
          >
            <Icon
              className='text-4xl mb-2'
              icon={icon}
            />
            <span className='text-sm font-semibold text-gray-800 text-center'>
              {title}
            </span>
          </Link>
        ))}
      </div>

      {/* 🟩 User Activity */}
      {dashboardMetrics && (
        <div className='my-6'>
          <h2 className='text-xl font-semibold mb-4'>Hoạt động người dùng</h2>
          <pre className='bg-gray-100 p-4 rounded text-sm'>
            {JSON.stringify(dashboardMetrics.userActivity, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
