import { Button, Input, Spinner, Tab, Tabs } from '@heroui/react';
import { useState } from 'react';
import { Icon } from '@iconify/react';

import { GradePayload } from '@/types/grade';
import { useGrades } from '@/hooks/useGrades';
import { useSubjectsByGrade } from '@/hooks/useGradeSubject';
import { useSubjects } from '@/hooks/useSubjects';
import { ContributeModal } from '@/components/content/contribute-modal';
import { QuestionSidebar } from '@/components/lesson/lesson-sidebar';
import { useLessonsByChapter } from '@/hooks/useLesson';
import { LessonCard } from '@/components/lesson/lesson-card';
import { LessonPayload } from '@/types/lesson';

export const QuestionComponent: React.FC = () => {
  // Tab hiện tại
  const [selectedGrade, setSelectedGrade] = useState<string | number>('all');

  // State cho tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');

  // State quản lý subject/chapter
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    null
  );
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  // Modal
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);

  // API hooks
  const { data: grades, isLoading, isError } = useGrades();

  // Tính gradeId đang chọn
  const selectedGradeId =
    selectedGrade !== 'all' && selectedGrade !== 'other'
      ? Number(selectedGrade)
      : undefined;

  // Gọi hai hook subject
  const allSubjectsQuery = useSubjects();
  const subjectsByGradeQuery = useSubjectsByGrade(selectedGradeId);

  const {
    data: lessons,
    isLoading: isLessonsLoading,
    isError: isLessonsError,
  } = useLessonsByChapter(selectedChapterId || undefined);

  // Chọn data tương ứng
  const subjects =
    selectedGrade === 'all' ? allSubjectsQuery.data : subjectsByGradeQuery.data;

  const isSubjectsLoading =
    selectedGrade === 'all'
      ? allSubjectsQuery.isLoading
      : subjectsByGradeQuery.isLoading;

  const isSubjectsError =
    selectedGrade === 'all'
      ? allSubjectsQuery.isError
      : subjectsByGradeQuery.isError;

  // --- HANDLERS ---
  const handleSubjectSelect = (subjectId: number) => {
    // nếu click lại cùng subject thì collapse
    setSelectedSubjectId((prev) => (prev === subjectId ? null : subjectId));
    setSelectedChapterId(null);
  };

  const handleChapterSelect = (chapterId: number) => {
    setSelectedChapterId(chapterId);
  };

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      {isLoading ? (
        <div className='flex justify-center py-8'>
          <Spinner label='Đang tải khối học...' />
        </div>
      ) : isError ? (
        <div className='text-danger text-center py-8'>
          Không thể tải danh sách khối học
        </div>
      ) : (
        <Tabs
          aria-label='Khối học'
          classNames={{
            tabList:
              'gap-4 w-full relative rounded-none p-0 border-b border-divider px-6',
            tabContent: 'text-base font-medium',
            cursor: 'bg-primary',
          }}
          color='primary'
          selectedKey={selectedGrade}
          variant='underlined'
          onSelectionChange={setSelectedGrade}
        >
          {/* Tabs header */}
          {grades?.map((grade: GradePayload) => (
            <Tab
              key={String(grade.id)}
              title={`Khối ${grade.level ?? grade.name}`}
            />
          ))}
          <Tab
            key='other'
            title='Khác'
          />
        </Tabs>
      )}

      {/* Tab Panel - chứa toàn bộ layout bên trong */}
      <div className='flex flex-1 mt-2'>
        {/* Sidebar */}
        <QuestionSidebar
          isLoading={isSubjectsLoading}
          selectedChapterId={selectedChapterId}
          selectedGradeId={selectedGradeId}
          selectedSubjectId={selectedSubjectId}
          subjects={subjects}
          onChapterSelect={handleChapterSelect}
          onSubjectSelect={handleSubjectSelect}
        />

        {/* Main Content */}
        <main className='flex-1 p-6'>
          <div className='mb-4 flex flex-col md:flex-row items-center justify-between gap-3'>
            <Button
              className='w-full md:w-auto'
              color='primary'
              startContent={<Icon icon='lucide:plus' />}
              variant='solid'
              onPress={() => setIsContributeModalOpen(true)}
            >
              Tạo câu hỏi
            </Button>

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

          {/* Subjects Grid */}
          <div className='mt-4'>
            {!selectedChapterId ? (
              <div className='text-center text-default-500 py-20'>
                <p>
                  Vui lòng chọn một chương trong sidebar để xem danh sách bài
                  học.
                </p>
              </div>
            ) : isLessonsLoading ? (
              <div className='flex justify-center py-20'>
                <Spinner label='Đang tải danh sách bài học...' />
              </div>
            ) : isError ? (
              <div className='text-center text-danger py-20'>
                Lỗi tải danh sách bài học.
              </div>
            ) : lessons && lessons.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {lessons.map((lesson: LessonPayload) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onSelect={(lessonId) => setSelectedLessonId(lessonId)}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center text-default-500 py-20'>
                Không có bài học nào trong chương này.
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
