import React from 'react';

import { useSubject } from '@/hooks/useSubjects';

export const SubjectSummaryItem = ({
  subjectId,
  count,
}: {
  subjectId: number;
  count: number;
}) => {
  const { data: subject } = useSubject(subjectId);

  return (
    <div className='flex justify-between text-sm py-1'>
      <span>{subject?.name ?? `Môn ${subjectId}`}</span>
      <span className='font-medium'>{count}</span>
    </div>
  );
};

export const SubjectSummaryList = ({
  subjectIds,
  totalsBySubjectId,
}: {
  subjectIds: number[];
  totalsBySubjectId: Record<number, number>;
}) => {
  if (!subjectIds.length)
    return <p className='text-sm text-gray-500'>Không có dữ liệu theo môn</p>;

  return (
    <div>
      {subjectIds.map((id) => (
        <SubjectSummaryItem
          key={id}
          count={totalsBySubjectId[id] ?? 0}
          subjectId={id}
        />
      ))}
    </div>
  );
};
