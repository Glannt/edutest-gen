import React from 'react';

import { useLevel } from '@/hooks/useLevels';

export const LevelSummaryItem = ({
  levelId,
  count,
}: {
  levelId: number;
  count: number;
}) => {
  const { data: level } = useLevel(levelId);

  return (
    <div className='flex justify-between text-sm py-1'>
      <span>{level?.name ?? `Mức ${levelId}`}</span>
      <span className='font-medium'>{count}</span>
    </div>
  );
};

export const LevelSummaryList = ({
  levelIds,
  totalsByLevelId,
}: {
  levelIds: number[];
  totalsByLevelId: Record<number, number>;
}) => {
  if (!levelIds.length)
    return (
      <p className='text-sm text-gray-500'>Không có dữ liệu theo mức độ</p>
    );

  return (
    <div>
      {levelIds.map((id) => (
        <LevelSummaryItem
          key={id}
          count={totalsByLevelId[id] ?? 0}
          levelId={id}
        />
      ))}
    </div>
  );
};
