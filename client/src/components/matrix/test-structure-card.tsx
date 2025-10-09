import { StructureItemCard } from './structure-item-card';

import { useMatrixSummary } from '@/hooks/useMatrixSummary';
import { useMatrixStore } from '@/store/matrix.store';
import { useSubjects } from '@/hooks/useSubjects';
import { useLevels } from '@/hooks/useLevels';

export const TestStructureCard = () => {
  const { structures } = useMatrixStore();
  const summary = useMatrixSummary();
  const { data: subjects } = useSubjects();
  const { data: levels } = useLevels();

  if (!structures.length)
    return (
      <p className='text-gray-500 text-center py-8'>
        Chưa có cấu trúc nào được thêm.
      </p>
    );

  const getSubjectName = (id?: number) =>
    subjects?.find((s) => s.id === id)?.name ?? '—';
  const getLevelName = (id?: number) =>
    levels?.find((l) => l.id === id)?.name ?? '—';

  return (
    <div className='p-4 space-y-4'>
      {structures.map((item) => (
        <StructureItemCard
          key={item.id}
          item={item}
        />
      ))}

      {/* === Summary Section === */}
      <div className='border-t pt-4 mt-4 text-sm text-gray-700'>
        <p className='font-semibold text-base mb-2'>📊 Tổng kết:</p>

        <ul className='list-disc ml-5 space-y-1'>
          <li>
            <span className='font-medium'>Tổng số câu hỏi:</span>{' '}
            {summary.totalQuestions}
          </li>

          <li>
            <span className='font-medium'>Theo môn học:</span>{' '}
            {summary.uniqueSubjectIds
              .map(
                (sid) =>
                  `${getSubjectName(sid)}: ${summary.totalsBySubjectId[sid]} câu`
              )
              .join(', ')}
          </li>

          <li>
            <span className='font-medium'>Theo mức độ:</span>{' '}
            {summary.uniqueLevelIds
              .map(
                (lid) =>
                  `${getLevelName(lid)}: ${summary.totalsByLevelId[lid]} câu`
              )
              .join(', ')}
          </li>
        </ul>
      </div>
    </div>
  );
};
