import React from 'react';
import { Select, SelectItem, Spinner } from '@heroui/react';

import { useMatrices } from '@/hooks/useMatrix';
import { MatrixResponse } from '@/types/matrix';

interface MatrixSelectorProps {
  selectedMatrixId: number;
  onMatrixSelect: (id: number) => void;
}

export const MatrixSelector: React.FC<MatrixSelectorProps> = ({
  selectedMatrixId,
  onMatrixSelect,
}) => {
  const { data: matrices, isLoading } = useMatrices();

  if (isLoading) {
    return (
      <div className='py-4 flex justify-center'>
        <Spinner label='Đang tải ma trận...' />
      </div>
    );
  }

  if (!matrices?.content || matrices.content.length === 0) {
    return <div className='text-gray-500'>Chưa có ma trận nào</div>;
  }

  return (
    <Select
      isRequired
      label='Ma trận đề thi'
      placeholder='Chọn ma trận đề thi'
      selectedKeys={selectedMatrixId ? [selectedMatrixId.toString()] : []}
      onSelectionChange={(keys) => {
        const selectedKey = Array.from(keys)[0];

        if (selectedKey) {
          onMatrixSelect(Number(selectedKey)); // chuyển string | number thành number
        }
      }}
    >
      {matrices.content.map((matrix: MatrixResponse) => (
        <SelectItem key={matrix.id}>{matrix.name}</SelectItem>
      ))}
    </Select>
  );
};
