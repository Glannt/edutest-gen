import React, { useMemo } from 'react';

import { MatrixResponse } from '@/types/matrix';
interface MatrixTableProps {
  matrices: MatrixResponse;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
export const MatrixTable = ({ matrix }: { matrix: MatrixResponse }) => {
  const { matrixDetails, totalQuestions } = matrix;

  // Lấy danh sách levels và questionTypes có trong matrix
  const levels = useMemo(
    () => Array.from(new Set(matrixDetails.map((d) => d.level))),
    [matrixDetails]
  );
  const questionTypes = useMemo(
    () => Array.from(new Set(matrixDetails.map((d) => d.question_type_name))),
    [matrixDetails]
  );

  // Gom theo chapter
  const chapterGroups = useMemo(() => {
    const map = new Map<string, typeof matrixDetails>();

    matrixDetails.forEach((d) => {
      const key = d.chapter_name || '—';

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    });

    return map;
  }, [matrixDetails]);

  // Hàm tính tổng câu theo level và questionType cho lesson
  const countByQuestionType = (lessonItems: typeof matrixDetails) => {
    const result: Record<string, number> = {};

    questionTypes.forEach((qt) => (result[qt] = 0));
    lessonItems.forEach((it) => {
      if (it.question_type_name)
        result[it.question_type_name] += it.quantity || 0;
    });

    return result;
  };

  const calcTotalScore = (lessonItems: typeof matrixDetails) =>
    lessonItems.reduce((sum, it) => sum + (it.quantity || 0), 0);

  return (
    <div className='w-full overflow-x-auto'>
      <table className='w-full border-collapse text-sm'>
        <thead>
          <tr>
            <th className='border px-3 py-2'>CHƯƠNG</th>
            <th className='border px-3 py-2'>BÀI HỌC</th>
            {levels.map((lv) =>
              questionTypes.map((qt) => (
                <th
                  key={`${lv}_${qt}`}
                  className='border px-3 py-2 text-center'
                >
                  {lv.name} / {qt}
                </th>
              ))
            )}
            {questionTypes.map((qt) => (
              <th
                key={`sum_${qt}`}
                className='border px-3 py-2 text-center'
              >
                Tổng {qt}
              </th>
            ))}
            <th className='border px-3 py-2 text-center'>% Tổng điểm</th>
          </tr>
        </thead>

        <tbody>
          {Array.from(chapterGroups.entries()).map(([chapterName, items]) => {
            // Gom theo lesson
            const lessonGroups = new Map<string, typeof items>();

            items.forEach((it) => {
              const key = it.lesson.name || '—';

              if (!lessonGroups.has(key)) lessonGroups.set(key, []);
              lessonGroups.get(key)!.push(it);
            });

            const chapterRowSpan = lessonGroups.size;

            return Array.from(lessonGroups.entries()).map(
              ([lessonName, lessonItems], idx) => {
                const typeCounts = countByQuestionType(lessonItems);
                const totalScore = calcTotalScore(lessonItems);

                return (
                  <tr key={`${chapterName}_${lessonName}`}>
                    {idx === 0 && (
                      <td
                        className='border px-3 py-2 text-center font-medium align-middle'
                        rowSpan={chapterRowSpan}
                      >
                        {chapterName}
                      </td>
                    )}
                    <td className='border px-3 py-2'>{lessonName}</td>

                    {/* Các cột động level x questionType */}
                    {levels.map((lv) =>
                      questionTypes.map((qt) => {
                        const found = lessonItems.find(
                          (it) =>
                            it.level === lv && it.question_type_name === qt
                        );

                        return (
                          <td
                            key={`${lessonName}_${lv}_${qt}`}
                            className='border px-3 py-2 text-center'
                          >
                            {found ? found.quantity : ''}
                          </td>
                        );
                      })
                    )}

                    {/* Tổng theo questionType */}
                    {questionTypes.map((qt) => (
                      <td
                        key={`sum_${lessonName}_${qt}`}
                        className='border px-3 py-2 text-center font-semibold'
                      >
                        {typeCounts[qt] || ''}
                      </td>
                    ))}

                    {/* % Tổng điểm */}
                    <td className='border px-3 py-2 text-center font-bold'>
                      {totalQuestions
                        ? `${((totalScore / totalQuestions) * 100).toFixed(0)}%`
                        : totalScore}
                    </td>
                  </tr>
                );
              }
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
