import React from 'react';
import { Select, SelectItem, Input } from '@heroui/react';
import { Icon } from '@iconify/react';

export const QuestionBank: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div>
      <div
        className={`flex items-center justify-between p-4 ${isExpanded ? 'bg-blue-500 text-white' : 'border-b'} cursor-pointer`}
        role='button'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='flex items-center gap-2'>
          <Icon icon='lucide:database' />
          <span className='font-medium text-lg'>4. Ngân hàng câu hỏi</span>
        </div>
        <Icon
          className='text-xl'
          icon={isExpanded ? 'lucide:chevron-up' : 'lucide:chevron-down'}
        />
      </div>

      {isExpanded && (
        <div className='p-4'>
          <p className='text-sm text-gray-600 mb-4'>
            Duyệt, chọn và quản lí các câu hỏi đã được AI phân loại.
          </p>

          <div className='mb-4'>
            {/* <label className='block mb-2 text-sm font-medium'>Môn học</label> */}
            <Select
              className='w-full'
              placeholder='-- Chọn môn --'
              title='Môn học'
              variant='bordered'
            >
              <SelectItem key='toan'>Toán học</SelectItem>
              <SelectItem key='van'>Ngữ văn</SelectItem>
              <SelectItem key='anh'>Tiếng Anh</SelectItem>
            </Select>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              {/* <label className='block mb-2 text-sm font-medium'>Lớp</label> */}
              <Select
                className='w-full'
                placeholder='-- Chọn môn --'
                title='Lớp'
                variant='bordered'
              >
                <SelectItem key='lop10'>Lớp 10</SelectItem>
                <SelectItem key='lop11'>Lớp 11</SelectItem>
                <SelectItem key='lop12'>Lớp 12</SelectItem>
              </Select>
            </div>

            <div>
              {/* <label className='block mb-2 text-sm font-medium'>Bài học</label> */}
              <Select
                className='w-full'
                placeholder='-- Chọn lớp --'
                title='Bài học'
                variant='bordered'
              >
                <SelectItem key='bai1'>Bài 1</SelectItem>
                <SelectItem key='bai2'>Bài 2</SelectItem>
                <SelectItem key='bai3'>Bài 3</SelectItem>
              </Select>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <div>
              {/* <label className='block mb-2 text-sm font-medium'>Loại</label> */}
              <Select
                className='w-full'
                title='Loại'
                variant='bordered'
              >
                <SelectItem key='all'>Tất cả</SelectItem>
                <SelectItem key='tracnghiem'>Trắc nghiệm</SelectItem>
                <SelectItem key='tuluan'>Tự luận</SelectItem>
              </Select>
            </div>

            <div>
              {/* <label className='block mb-2 text-sm font-medium'>Mức độ</label> */}
              <Select
                className='w-full'
                defaultSelectedKeys={['all']}
                title='Mức độ'
                variant='bordered'
              >
                <SelectItem key='all'>Tất cả</SelectItem>
                <SelectItem key='thonghieu'>Thông hiểu</SelectItem>
                <SelectItem key='vd'>Vận dụng</SelectItem>
              </Select>
            </div>

            <div>
              {/* <label
                className='block mb-2 text-sm font-medium'
                htmlFor='select1'
              >
                Yêu cầu
              </label> */}
              <Select
                className='w-full'
                placeholder='-- Tất cả --'
                title='Yêu cầu'
                variant='bordered'
              >
                <SelectItem key='all'>-- Tất cả --</SelectItem>
                <SelectItem key='req1'>Yêu cầu 1</SelectItem>
                <SelectItem key='req2'>Yêu cầu 2</SelectItem>
              </Select>
            </div>
          </div>

          <div className='mb-4'>
            <Input
              className='w-full'
              placeholder='Tìm kiếm câu hỏi...'
              startContent={<Icon icon='lucide:search' />}
              type='text'
              variant='bordered'
            />
          </div>
        </div>
      )}
    </div>
  );
};
