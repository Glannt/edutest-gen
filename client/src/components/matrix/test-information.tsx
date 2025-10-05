import React from 'react';
import { Input, Select, SelectItem, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

export const TestInformation: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div>
      <div
        className={`flex items-center justify-between p-4 ${isExpanded ? 'bg-blue-500 text-white' : 'border-b'} cursor-pointer`}
        role='button'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='flex items-center gap-2'>
          <Icon icon='lucide:info' />
          <span className='font-medium text-lg'>2. Thông tin & Định dạng</span>
        </div>
        <Icon
          className='text-xl'
          icon={isExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'}
        />
      </div>

      {isExpanded && (
        <div className='p-4'>
          <div className='mb-4'>
            {/* <label className='block mb-2 text-sm font-medium'>Tên đề thi</label> */}
            <div className='flex gap-2'>
              <Input
                className='flex-1'
                placeholder='Ví dụ: Đề kiểm tra 15 phút - Chương I'
                title='Tên đề thi'
                type='text'
                variant='bordered'
              />
              <Button
                isIconOnly
                color='warning'
              >
                <Icon icon='lucide:pin' />
              </Button>
            </div>
          </div>

          <div className='mb-4'>
            {/* <label className='block mb-2 text-sm font-medium'>
              Định dạng công thức toán học
            </label> */}
            <Select
              className='w-full'
              label='Văn bản thường'
              title='Định dạng công thức toán học'
              variant='bordered'
            >
              <SelectItem key='vanban'>Văn bản thường</SelectItem>
              <SelectItem key='latex'>LaTeX</SelectItem>
              <SelectItem key='mathml'>MathML</SelectItem>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};
