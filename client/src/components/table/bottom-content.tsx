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
    <div className='py-2 px-2 flex justify-between items-center'>
      <span className='w-[30%] text-small text-default-400'>
        {selectedKeys === 'all'
          ? 'All items selected'
          : `${totalSelected} of ${totalItems} selected`}
      </span>
      <Pagination
        isCompact
        showControls
        showShadow
        color='primary'
        page={page}
        total={pages}
        onChange={onPageChange}
      />
      <div className='hidden sm:flex w-[30%] justify-end gap-2'>
        <Button
          isDisabled={pages === 1}
          size='sm'
          variant='flat'
          onPress={onPreviousPage}
        >
          Previous
        </Button>
        <Button
          isDisabled={pages === 1}
          size='sm'
          variant='flat'
          onPress={onNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
