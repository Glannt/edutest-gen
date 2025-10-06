import { Button, Input, ScrollShadow, Spinner, Tab, Tabs } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import { ContentSidebar } from '@/components/content/content-sidebar';
import { GradePayload } from '@/types/grade';
import { useGrades } from '@/hooks/useGrades';
import { BasePayload, GenericCard } from '@/components/content/generic-card';
import { useSubjectsByGrade } from '@/hooks/useGradeSubject';
import { useSubjects } from '@/hooks/useSubjects';
import { SubjectPayload } from '@/types/subject';
import { ContributeModal } from '@/components/content/contribute-modal';
export const ContentComponent: React.FC = () => {
  const [selected, setSelected] = useState<string | number>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: grades, isLoading, isError } = useGrades();

  // Lấy gradeId từ tab đang chọn
  const selectedGradeId =
    selected !== 'all' && selected !== 'other' ? Number(selected) : undefined;

  // Luôn gọi cả hai hook
  const allSubjectsQuery = useSubjects();
  const subjectsByGradeQuery = useSubjectsByGrade(selectedGradeId);

  // Chọn dữ liệu dựa vào tab
  const subjects =
    selected === 'all' ? allSubjectsQuery.data : subjectsByGradeQuery.data;

  const isSubjectsLoading =
    selected === 'all'
      ? allSubjectsQuery.isLoading
      : subjectsByGradeQuery.isLoading;

  const isSubjectsError =
    selected === 'all'
      ? allSubjectsQuery.isError
      : subjectsByGradeQuery.isError;

  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      {/* Header */}
      {/* <header className='border-b border-divider bg-content1 px-4'>
            <div className='flex items-center justify-between h-16'>
              <div className='flex items-center gap-4'>
                <Button
                  isIconOnly
                  aria-label='Go back'
                  variant='light'
                >
                  <Icon
                    className='text-lg'
                    icon='lucide:chevron-left'
                  />
                </Button>
                <span className='font-medium'>Quay lại</span>
              </div>

              <div className='flex items-center gap-3'>
                <div className='relative max-w-xs w-64'>
                  <Input
                    classNames={{
                      base: 'max-w-full',
                      inputWrapper: 'bg-default-100',
                    }}
                    placeholder='Tìm kiếm'
                    size='sm'
                    startContent={
                      <Icon
                        className='text-default-400'
                        icon='lucide:search'
                      />
                    }
                    type='search'
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                </div>

                <Button
                  color='primary'
                  startContent={<Icon icon='lucide:award' />}
                  variant='solid'
                >
                  Mua point
                </Button>

                <Button
                  color='primary'
                  startContent={<Icon icon='lucide:diamond' />}
                  variant='solid'
                >
                  Nâng VIP
                </Button>

                <Button
                  isIconOnly
                  variant='light'
                >
                  <img
                    alt='Vietnamese flag'
                    className='h-6 w-6'
                    src='https://img.heroui.chat/image/places?w=24&h=24&u=flag-vn'
                  />
                </Button>

                <Badge
                  color='danger'
                  content=''
                  placement='top-right'
                  shape='circle'
                >
                  <Button
                    isIconOnly
                    variant='light'
                  >
                    <Icon
                      className='text-xl'
                      icon='lucide:bell'
                    />
                  </Button>
                </Badge>

                <div className='flex items-center gap-2'>
                  <Avatar
                    name='Thanh'
                    size='sm'
                    src='https://img.heroui.chat/image/avatar?w=40&h=40&u=user1'
                  />
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>thanh</span>
                    <span className='text-xs text-default-500'>Giáo viên</span>
                  </div>
                </div>
              </div>
            </div>
          </header> */}

      <div className='flex flex-1'>
        {/* Sidebar */}
        <ContentSidebar />

        {/* Main Content */}
        <main className='flex-1 p-4 '>
          <div className='mb-4 flex flex-col md:flex-row items-center justify-between gap-3'>
            {/* Button ở bên trái */}
            <Button
              className='w-full md:w-auto'
              color='primary'
              startContent={<Icon icon='lucide:plus' />}
              variant='solid'
              onPress={() => setIsContributeModalOpen(true)}
            >
              Đóng góp nội dung
            </Button>

            {/* Input ở bên phải */}
            <div className='relative w-full md:w-64'>
              <Input
                classNames={{
                  base: 'max-w-full',
                  inputWrapper: 'bg-default-100',
                }}
                placeholder='Tìm kiếm'
                size='sm'
                startContent={
                  <Icon
                    className='text-default-400'
                    icon='lucide:search'
                  />
                }
                type='search'
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
          </div>

          {/* Tabs instead of buttons */}
          <div className='mb-6'>
            {isLoading ? (
              <div className='flex justify-center py-4'>
                <Spinner label='Đang tải khối học...' />
              </div>
            ) : isError ? (
              <div className='text-danger text-center py-4'>
                Không thể tải danh sách khối học
              </div>
            ) : (
              <Tabs
                aria-label='Khối học'
                classNames={{
                  tabList:
                    'gap-4 w-full relative rounded-none p-0 border-b border-divider',
                  cursor: 'w-full bg-primary',
                  tab: 'max-w-fit px-2 h-10 data-[selected=true]:text-primary',
                }}
                color='primary'
                selectedKey={selected}
                variant='underlined'
                onSelectionChange={setSelected}
              >
                {/* Tab cố định đầu tiên */}
                <Tab
                  key='all'
                  title='Tất cả'
                />

                {/* ✅ Map khối học từ API */}
                {grades?.map((grade: GradePayload) => (
                  <Tab
                    key={String(grade.id)}
                    title={`Khối ${grade.level ?? grade.name}`}
                  />
                ))}

                {/* Tab "Khác" cuối cùng */}
                <Tab
                  key='other'
                  title='Khác'
                />
              </Tabs>
            )}
          </div>

          {/* Subjects Cards */}
          <div className='mt-4'>
            {isSubjectsLoading ? (
              <div className='flex justify-center py-4'>
                <Spinner label='Đang tải môn học...' />
              </div>
            ) : isSubjectsError ? (
              <div className='text-danger text-center py-4'>
                Không thể tải danh sách môn học
              </div>
            ) : subjects && subjects.length > 0 ? (
              <ScrollShadow className='h-[calc(100vh-220px)]'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {subjects.map((subject: SubjectPayload) => (
                    <GenericCard
                      key={subject.id}
                      item={subject as BasePayload} // ép type để GenericCard nhận
                      type='subject'
                      onClick={(item) => console.log('Clicked subject:', item)}
                    />
                  ))}
                </div>
              </ScrollShadow>
            ) : (
              <div className='text-center text-default-500 py-4'>
                Không có môn học cho khối này
              </div>
            )}
          </div>
        </main>
      </div>
      <ContributeModal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
        onCreateQuestion={() => {}}
      />
    </div>
  );
};
