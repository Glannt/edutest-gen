// components/matrix/StructureItemCard.tsx
import { Button, Card, Divider, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';

import { useMatrixStore } from '@/store/matrix.store';
import { useGrade } from '@/hooks/useGrades';
import { useSubject } from '@/hooks/useSubjects';
import { useChapter } from '@/hooks/useChapter';
import { useLesson } from '@/hooks/useLesson';
import { useLevel } from '@/hooks/useLevels';
import { useQuestionType } from '@/store/useQuestionTypeStore';

interface StructureItemCardProps {
  item: {
    id: number;
    gradeId?: number;
    subjectId?: number;
    chapterId?: number;
    lessonId?: number;
    levelId?: number;
    questionTypeId?: number;
    questionCount: number;
  };
}

export const StructureItemCard = ({ item }: StructureItemCardProps) => {
  const removeStructure = useMatrixStore((s: any) => s.removeStructure);

  const { data: grade, isLoading: loadingGrade } = useGrade(item.gradeId);
  const { data: subject, isLoading: loadingSubject } = useSubject(
    item.subjectId
  );
  const { data: chapter, isLoading: loadingChapter } = useChapter(
    item.chapterId
  );
  const { data: lesson, isLoading: loadingLesson } = useLesson(item.lessonId);
  const { data: level, isLoading: loadingLevel } = useLevel(item.levelId);
  const { data: questionType, isLoading: loadingQuestionType } =
    useQuestionType(Number(item.questionTypeId));

  const isLoading =
    loadingGrade ||
    loadingSubject ||
    loadingChapter ||
    loadingLesson ||
    loadingLevel ||
    loadingQuestionType;

  if (isLoading) {
    return (
      <Card className='p-4 flex justify-center items-center border border-gray-200 rounded-lg shadow-sm'>
        <Spinner
          color='primary'
          label='Đang tải...'
        />
      </Card>
    );
  }

  return (
    <Card className='relative group border border-gray-200 hover:border-primary transition-all p-4 rounded-lg shadow-sm'>
      <div className='flex justify-between items-start mb-2'>
        <div>
          <p className='font-semibold text-base text-primary'>
            {subject?.name ?? '—'} - Lớp {grade?.name ?? '—'}
          </p>
          <p className='text-sm text-gray-600'>
            <span className='font-medium'>Chương:</span> {chapter?.name ?? '—'}
          </p>
          <p className='text-sm text-gray-600'>
            <span className='font-medium'>Bài học:</span> {lesson?.name ?? '—'}
          </p>
        </div>

        <Button
          isIconOnly
          aria-label='Xóa cấu trúc'
          className='absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition'
          color='danger'
          variant='light'
          onPress={() => removeStructure(item.id)}
        >
          <Icon icon='lucide:trash-2' />
        </Button>
      </div>

      <Divider className='my-2' />

      <div className='grid grid-cols-3 gap-x-4 text-sm'>
        <div>
          <p className='font-medium text-gray-700'>Mức độ</p>
          <p className='text-gray-800'>{level?.name ?? '—'}</p>
        </div>

        <div>
          <p className='font-medium text-gray-700'>Loại câu hỏi</p>
          <p className='text-gray-800'>{questionType?.name ?? '—'}</p>
        </div>

        <div>
          <p className='font-medium text-gray-700'>Số câu hỏi</p>
          <p className='text-gray-800'>{item.questionCount}</p>
        </div>
      </div>
    </Card>
  );
};
