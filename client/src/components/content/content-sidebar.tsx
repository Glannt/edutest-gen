import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

export const ContentSidebar: React.FC = () => {
  return (
    <aside className='w-[280px] bg-content1 border-r border-divider hidden md:block'>
      <div className='p-2'>
        <div className='bg-primary-500 text-white rounded-md p-3 mb-4'>
          <div className='flex items-center gap-2'>
            <Icon icon='lucide:home' />
            <span className='font-medium'>Tất cả tài liệu</span>
          </div>
        </div>

        <div className='space-y-1'>
          <Button
            className='justify-start w-full text-default-700'
            startContent={<Icon icon='lucide:file-text' />}
            variant='light'
          >
            Tài liệu mới nhất
          </Button>

          <Button
            className='justify-start w-full text-default-700'
            startContent={<Icon icon='lucide:book-open' />}
            variant='light'
          >
            Bài tập, Đề thi
          </Button>

          <Button
            className='justify-start w-full text-default-700'
            startContent={<Icon icon='lucide:file-plus' />}
            variant='light'
          >
            Tài liệu tham khảo
          </Button>

          <Button
            className='justify-start w-full text-default-700'
            startContent={<Icon icon='lucide:video' />}
            variant='light'
          >
            Bài giảng Video
          </Button>

          <Button
            className='justify-start w-full text-default-700'
            startContent={<Icon icon='lucide:presentation' />}
            variant='light'
          >
            Slide Powerpoint
          </Button>

          <Button
            className='justify-start w-full text-default-700'
            startContent={<Icon icon='lucide:calendar' />}
            variant='light'
          >
            Kế hoạch bài giảng
          </Button>

          <Button
            className='justify-start w-full text-default-700'
            startContent={<Icon icon='lucide:user' />}
            variant='light'
          >
            Nội dung của bạn
          </Button>
        </div>
      </div>
    </aside>
  );
};
