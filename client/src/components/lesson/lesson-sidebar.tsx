import React from 'react';
import { Button, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';

import { SubjectPayload } from '@/types/subject';
import { ChapterPayload } from '@/types/chapter';
import { useChaptersByGradeAndSubject } from '@/hooks/useGradeSubject';

interface DynamicSidebarProps {
  selectedGradeId: number | undefined;
  subjects: SubjectPayload[] | undefined;
  isLoading: boolean;
  selectedSubjectId: number | null;
  selectedChapterId: number | null;
  onSubjectSelect: (subjectId: number) => void;
  onChapterSelect: (chapterId: number) => void;
}

export const QuestionSidebar: React.FC<DynamicSidebarProps> = ({
  selectedGradeId,
  subjects,
  isLoading,
  selectedSubjectId,
  selectedChapterId,
  onSubjectSelect,
  onChapterSelect,
}) => {
  // Fetch chapters for the selected subject
  const {
    data: chapters,
    isLoading: isChaptersLoading,
    isError: isChaptersError,
  } = useChaptersByGradeAndSubject(
    Number(selectedGradeId),
    Number(selectedSubjectId)
  );

  return (
    <aside className='w-[280px] bg-content1 border-r border-divider hidden md:block'>
      <div className='p-2'>
        {isLoading ? (
          <div className='flex justify-center py-8'>
            <Spinner label='Đang tải môn học...' />
          </div>
        ) : (
          <div className='space-y-2'>
            <h3 className='text-sm font-medium text-default-600 px-2 mb-1'>
              Môn học
            </h3>

            {subjects && subjects.length > 0 ? (
              subjects.map((subject) => (
                <div
                  key={subject.id}
                  className='mb-2'
                >
                  <Button
                    className='justify-start w-full text-default-700'
                    color={
                      selectedSubjectId === subject.id ? 'primary' : 'default'
                    }
                    endContent={
                      <Icon
                        className='text-sm'
                        icon={
                          selectedSubjectId === subject.id
                            ? 'lucide:chevron-down'
                            : 'lucide:chevron-right'
                        }
                      />
                    }
                    startContent={<Icon icon='lucide:book-open' />}
                    variant={
                      selectedSubjectId === subject.id ? 'solid' : 'light'
                    }
                    onPress={() => onSubjectSelect(subject.id)}
                  >
                    {subject.name}
                  </Button>

                  {selectedSubjectId === subject.id && (
                    <div className='ml-6 mt-2 space-y-1 border-l-2 border-default-200 pl-2'>
                      {isChaptersLoading ? (
                        <div className='py-2 px-1'>
                          <Spinner
                            label='Đang tải...'
                            size='sm'
                          />
                        </div>
                      ) : isChaptersError ? (
                        <div className='text-sm text-danger py-1 px-2'>
                          Lỗi tải dữ liệu
                        </div>
                      ) : chapters && chapters.length > 0 ? (
                        chapters.map((chapter: ChapterPayload) => (
                          <Button
                            key={chapter.id}
                            className={`justify-start w-full text-sm ${
                              selectedChapterId === chapter.id
                                ? 'text-primary font-medium'
                                : 'text-default-600'
                            }`}
                            startContent={
                              <Icon
                                className='text-sm'
                                icon='lucide:file-text'
                              />
                            }
                            variant='light'
                            onPress={() => onChapterSelect(chapter.id)}
                          >
                            {chapter.name}
                          </Button>
                        ))
                      ) : (
                        <div className='text-sm text-default-500 py-1 px-2'>
                          Không có chương nào
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className='text-center text-default-500 py-4'>
                Không có môn học nào
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
