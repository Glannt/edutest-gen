// components/matrix/MatrixRow.tsx
import React from 'react';

import { useChapter } from '@/hooks/useChapter';
import { useLesson } from '@/hooks/useLesson';

export const MatrixRow = ({
  item,
  isFirstInGroup,
  rowSpan,
  levels,
  questionTypes,
}: {
  item: any;
  isFirstInGroup: boolean;
  rowSpan?: number;
  levels: Array<{ id: number; name: string }>;
  questionTypes: Array<{ id: number; name: string }>;
}) => {
  const { data: chapter } = useChapter(item.chapterId);
  const { data: lesson } = useLesson(item.lessonId);

  return (
    <tr>
      {isFirstInGroup && (
        <td
          className='border px-4 py-3 text-center align-middle'
          rowSpan={rowSpan}
        >
          {chapter?.name ?? '—'}
        </td>
      )}

      <td className='border px-4 py-3'>{lesson?.name ?? '—'}</td>

      {levels.map((lv) =>
        questionTypes.map((qt) => {
          const show = item.levelId === lv.id && item.questionTypeId === qt.id;

          return (
            <td
              key={`${item.id}_${lv.id}_${qt.id}`}
              className='border px-3 py-2 text-center'
            >
              {show ? item.questionCount : ''}
            </td>
          );
        })
      )}

      {/* total per row */}
      <td className='border px-3 py-2 text-center font-semibold'>
        {item.questionCount}
      </td>
    </tr>
  );
};
