import React from 'react';
import { Button, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';

export const KnowledgeSources: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div>
      <div
        className={`flex items-center justify-between p-4 ${isExpanded ? 'bg-blue-500 text-white' : 'border-b'} cursor-pointer`}
        role='button'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='flex items-center gap-2'>
          <Icon icon='lucide:book-open' />
          <span className='font-medium text-lg'>
            3. Nguồn kiến thức (Tùy chọn)
          </span>
        </div>
        <Icon
          className='text-xl'
          icon={isExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'}
        />
      </div>

      {isExpanded && (
        <div className='p-4'>
          <p className='text-sm text-gray-600 mb-4'>
            Cung cấp thêm tài liệu để AI ra đề sát với yêu cầu thực tế hơn.
          </p>

          <Button
            className='w-full mb-4'
            color='primary'
            startContent={<Icon icon='lucide:upload' />}
            variant='flat'
          >
            Thêm tệp tham khảo
          </Button>

          <div className='mb-4'>
            <label
              className='block mb-2 text-sm font-medium'
              htmlFor='referenceUrls'
            >
              Nguồn URL tham khảo
            </label>
            <Textarea
              className='w-full'
              id='referenceUrls'
              minRows={4}
              placeholder='Dán các link web vào đây, mỗi link một dòng...'
              variant='bordered'
            />
          </div>
        </div>
      )}
    </div>
  );
};
