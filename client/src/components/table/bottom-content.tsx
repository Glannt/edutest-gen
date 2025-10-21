import React from 'react';
import { Button, Pagination } from '@heroui/react';

interface Props {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  selectedKeys: any;
  totalSelected: number;
  totalItems: number;
}

export const BottomContent: React.FC<Props> = ({
  page,
  pages,
  onPageChange,
  onNextPage,
  onPreviousPage,
  selectedKeys,
  totalSelected,
  totalItems,
}) => {
  return (
    <div className='w-full py-2 px-2 flex justify-center items-center gap-2'>
      <Button
        isDisabled={page === 1}
        size='sm'
        variant='flat'
        onPress={onPreviousPage}
      >
        Trước
      </Button>

      <Pagination
        isCompact
        showControls
        showShadow
        color='primary'
        page={page}
        total={pages}
        onChange={onPageChange}
      />

      <Button
        isDisabled={page === pages}
        size='sm'
        variant='flat'
        onPress={onNextPage}
      >
        Sau
      </Button>
    </div>
  );
};
