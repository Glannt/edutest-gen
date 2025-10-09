import { LessonCard } from './lesson-card';

import { LessonPayload } from '@/types/lesson';

interface LessonGridProps {
  lessons: LessonPayload[];
  onSelect: (id: number) => void;
}

export const LessonGrid: React.FC<LessonGridProps> = ({
  lessons,
  onSelect,
}) => {
  if (!lessons || lessons.length === 0)
    return (
      <div className='text-center text-default-500 py-20'>
        Không có bài học nào.
      </div>
    );

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
