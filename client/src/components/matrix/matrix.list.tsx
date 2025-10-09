import React, { useState } from 'react';
import { Card, Spinner, Pagination } from '@heroui/react';
import { Icon } from '@iconify/react';

import { useMatrices } from '@/hooks/useMatrix';
import { MatrixTable } from '@/components/matrix/matrix-table';

export const MatrixList = () => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 5; // Số ma trận trên 1 trang

  const {
    data: matricesPage,
    isLoading,
    refetch,
  } = useMatrices(page, itemsPerPage);

  if (isLoading)
    return (
      <div className='flex justify-center items-center h-40'>
        <Spinner label='Đang tải danh sách ma trận...' />
      </div>
    );

  if (!matricesPage?.content || matricesPage.content?.length === 0) {
    return <div className='text-center text-gray-500'>Chưa có ma trận nào</div>;
  }

  const totalPages = matricesPage.totalPages || 1;

  return (
    <div className='space-y-6'>
      {matricesPage.content.map((matrix) => (
        <Card
          key={matrix.id}
          className='shadow-sm'
        >
          <div className='p-4 flex items-center gap-2 border-b'>
            <Icon
              className='text-lg'
              icon='lucide:grid'
            />
            <span className='font-semibold text-lg'>{matrix.name}</span>
          </div>
          <div className='p-4'>
            <MatrixTable matrix={matrix} />
          </div>
        </Card>
      ))}

      {/* Pagination */}
      {totalPages >= 1 && (
        <div className='flex justify-center mt-4'>
          <Pagination
            showControls
            boundaries={1}
            page={page}
            siblings={1}
            total={totalPages}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  );
};
