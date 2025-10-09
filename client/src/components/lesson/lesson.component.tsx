import { Button, Input, Spinner, Tab, Tabs } from '@heroui/react';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

import { GradePayload } from '@/types/grade';
import { useGrades } from '@/hooks/useGrades';
import { useSubjectsByGrade } from '@/hooks/useGradeSubject';
import { useSubjects } from '@/hooks/useSubjects';
import { LessonSidebar } from '@/components/lesson/lesson-sidebar';
import { useLessonsByChapter } from '@/hooks/useLesson';
import { LessonGrid } from '@/components/lesson/lesson-grid';
import { QuestionSelectModal } from '@/components/question/modal/question-select-modal';

export const LessonComponent: React.FC = () => {
  const navigate = useNavigate();
  // Tab hiện tại
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

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

  // chọn default tabs
  useEffect(() => {
    if (grades && grades.length > 0 && !selectedGrade) {
      setSelectedGrade(grades[0].id);
    }
  }, [grades, selectedGrade]);

  // handle select param lesson id
  const handleSelect = (lessonId: number) => {
    // 1️⃣ Lưu vào store hoặc state nếu cần
    setSelectedLessonId?.(lessonId);

    // 2️⃣ Điều hướng tới QuestionListByLesson
    navigate(`/dashboard/lesson/${lessonId}/questions`);
  };

  // Tính gradeId đang chọn
  const selectedGradeId = Number(selectedGrade)
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
  const subjects = subjectsByGradeQuery.data;

  const isSubjectsLoading = subjectsByGradeQuery.isLoading;

  const isSubjectsError = subjectsByGradeQuery.isError;

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
          selectedKey={selectedGrade?.toString() ?? ''}
          variant='underlined'
          onSelectionChange={(key) => setSelectedGrade(Number(key))}
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
        <LessonSidebar
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

          {/* Chapter Grid */}
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
              // <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              //   {lessons.map((lesson: LessonPayload) => (
              //     <LessonCard
              //       key={lesson.id}
              //       lesson={lesson}
              //       onSelect={handleSelect}
              //     />
              //   ))}
              // </div>
              <LessonGrid
                lessons={lessons}
                onSelect={handleSelect}
              />
            ) : (
              <div className='text-center text-default-500 py-20'>
                Không có bài học nào trong chương này.
              </div>
            )}
          </div>
        </main>
      </div>

      <QuestionSelectModal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
      />
    </div>
  );
};
