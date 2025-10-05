import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

export const DataManagement: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div>
      <div
        className={`flex items-center justify-between p-4 ${isExpanded ? 'bg-blue-500 text-white' : 'border-b'} cursor-pointer`}
        role='button'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='flex items-center gap-2'>
          <Icon icon='lucide:settings' />
          <span className='font-medium text-lg'>Quản lý Dữ liệu</span>
        </div>
        <Icon
          className='text-xl'
          icon={isExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'}
        />
      </div>

      {isExpanded && (
        <div className='p-4'>
          <p className='text-sm text-gray-600 mb-4'>
            Các thay đổi của bạn với &quot;Yêu cầu cần đạt&quot; sẽ được lưu trữ
            động. Sử dụng các nút dưới đây để quản lý dữ liệu môn học.
          </p>

          <div className='space-y-3'>
            <Button
              className='w-full'
              color='default'
              startContent={<Icon icon='lucide:download' />}
              variant='bordered'
            >
              Sao lưu dữ liệu ra tệp
            </Button>

            <Button
              className='w-full'
              color='primary'
              startContent={<Icon icon='lucide:upload' />}
              variant='flat'
            >
              Nạp dữ liệu từ tệp
            </Button>

            <Button
              className='w-full'
              color='danger'
              startContent={<Icon icon='lucide:refresh-ccw' />}
              variant='flat'
            >
              Reset về dữ liệu gốc
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
