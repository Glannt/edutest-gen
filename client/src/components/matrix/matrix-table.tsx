import React, { useMemo } from 'react';
import { CircularProgress } from '@heroui/react';

import { MatrixResponse } from '@/types/matrix';
import { useLevels } from '@/hooks/useLevels';
import { useQuestionTypes } from '@/hooks/useQuestionTypes';

interface MatrixTableProps {
  matrix: MatrixResponse;
  editable?: boolean;
  onChange?: (updatedMatrix: MatrixResponse) => void;
}

export const MatrixTable: React.FC<MatrixTableProps> = ({
  matrix,
  editable = false,
  onChange,
}) => {
  const { matrixDetails, totalQuestions } = matrix;

  /** --- Fetch dữ liệu chuẩn --- */
  const { data: levelsData, isLoading: loadingLevels } = useLevels();
  const { data: questionTypesData, isLoading: loadingQTypes } =
    useQuestionTypes();

  /** --- Gom nhóm theo chương --- */
  const chapterGroups = useMemo(() => {
    const map = new Map<string, typeof matrixDetails>();

    matrixDetails.forEach((d) => {
      const key = d.chapter_name || '—';

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    });

    return map;
  }, [matrixDetails]);

  /** --- Tính toán --- */
  const countByQuestionType = (lessonItems: typeof matrixDetails) => {
    const result: Record<string, number> = {};

    questionTypesData?.forEach((qt) => (result[qt.name] = 0));
    lessonItems.forEach((it) => {
      if (it.question_type_name)
        result[it.question_type_name] += it.quantity || 0;
    });

    return result;
  };

  const calcTotalScore = (lessonItems: typeof matrixDetails) =>
    lessonItems.reduce((sum, it) => sum + (it.quantity || 0), 0);

  /** --- Tổng toàn bảng --- */
  const totalByQuestionType = useMemo(() => {
    const result: Record<string, number> = {};

    questionTypesData?.forEach((qt) => (result[qt.name] = 0));
    matrixDetails.forEach((it) => {
      if (it.question_type_name)
        result[it.question_type_name] += it.quantity || 0;
    });

    return result;
  }, [matrixDetails, questionTypesData]);

  const totalAll = Object.values(totalByQuestionType).reduce(
    (a, b) => a + b,
    0
  );

  /** --- Xử lý thay đổi số lượng --- */
  const handleQuantityChange = (id: number, value: number | string) => {
    const newQuantity = Number(value);

    // Cập nhật matrixDetails
    const updatedDetails = matrix.matrixDetails.map((d) =>
      d.id === id ? { ...d, quantity: newQuantity } : d
    );

    // Tính lại tổng số câu hỏi
    const updatedTotalQuestions = updatedDetails.reduce(
      (sum, d) => sum + (d.quantity || 0),
      0
    );

    // Tạo object matrix mới
    const updatedMatrix = {
      ...matrix,
      matrixDetails: updatedDetails,
      totalQuestions: updatedTotalQuestions,
    };

    onChange?.(updatedMatrix);
  };

  /** --- Khi đang load --- */
  if (loadingLevels || loadingQTypes) {
    return (
      <CircularProgress className='p-4 text-center text-default-500'>
        Đang tải dữ liệu...
      </CircularProgress>
    );
  }

  /** --- Render --- */
  return (
    <div className='w-full overflow-x-auto'>
      <table className='w-full border-collapse text-sm'>
        <thead>
          <tr>
            <th
              className='border bg-table-header px-4 py-3 text-center font-bold'
              rowSpan={3}
            >
              CHƯƠNG
            </th>
            <th
              className='border bg-table-header px-4 py-3 text-center font-bold'
              rowSpan={3}
            >
              BÀI HỌC
            </th>
            <th
              className='border bg-table-header px-4 py-3 text-center font-bold'
              colSpan={levelsData!.length * questionTypesData!.length}
            >
              MỨC ĐỘ NHẬN THỨC × LOẠI CÂU HỎI
            </th>
            <th
              className='border bg-table-header px-4 py-3 text-center font-bold'
              colSpan={questionTypesData!.length}
            >
              TỔNG THEO LOẠI
            </th>
            <th
              className='border bg-table-header px-4 py-3 text-center font-bold'
              rowSpan={3}
            >
              % Tổng điểm
            </th>
          </tr>

          {/* Tầng 2: Level name */}
          <tr>
            {levelsData!.map((lv) => (
              <th
                key={lv.id}
                className='border bg-table-header px-3 py-2 text-center font-bold'
                colSpan={questionTypesData!.length}
              >
                {lv.name}
              </th>
            ))}
            {questionTypesData!.map((qt) => (
              <th
                key={`sum_${qt.id}`}
                className='border bg-table-header px-3 py-2 text-center font-bold'
                rowSpan={2}
              >
                Tổng {qt.name}
              </th>
            ))}
          </tr>

          {/* Tầng 3: Question types */}
          <tr>
            {levelsData!.flatMap((lv) =>
              questionTypesData!.map((qt) => (
                <th
                  key={`${lv.id}_${qt.id}`}
                  className='border bg-table-header px-3 py-2 text-center text-xs font-bold'
                >
                  {qt.name}
                </th>
              ))
            )}
          </tr>
        </thead>

        <tbody>
          {Array.from(chapterGroups.entries()).map(([chapterName, items]) => {
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
                        className='border px-4 py-3 text-center font-semibold align-middle bg-table-section-1'
                        rowSpan={chapterRowSpan}
                      >
                        {chapterName}
                      </td>
                    )}
                    <td className='border px-4 py-3 bg-table-section-2'>
                      {lessonName}
                    </td>

                    {/* Level × QuestionType */}
                    {levelsData!.map((lv) =>
                      questionTypesData!.map((qt) => {
                        const found = lessonItems.find(
                          (it) =>
                            it.level.id === lv.id &&
                            it.question_type_name === qt.name
                        );

                        return (
                          <td
                            key={`${lessonName}_${lv.id}_${qt.id}`}
                            className='border px-3 py-2 text-center'
                          >
                            {editable && found ? (
                              <input
                                className='w-16 text-center border rounded p-1'
                                type='number'
                                value={found.quantity ?? 0}
                                onChange={(e) =>
                                  handleQuantityChange(found.id, e.target.value)
                                }
                              />
                            ) : found ? (
                              found.quantity
                            ) : (
                              ''
                            )}
                          </td>
                        );
                      })
                    )}

                    {/* Tổng theo loại */}
                    {questionTypesData!.map((qt) => (
                      <td
                        key={`sum_${lessonName}_${qt.id}`}
                        className='border px-3 py-2 text-center font-semibold'
                      >
                        {typeCounts[qt.name] || ''}
                      </td>
                    ))}

                    {/* % Tổng điểm */}
                    <td className='border px-3 py-2 text-center font-bold text-primary'>
                      {totalQuestions
                        ? `${((totalScore / totalQuestions) * 100).toFixed(1)}%`
                        : totalScore}
                    </td>
                  </tr>
                );
              }
            );
          })}

          {/* Tổng cuối */}
          <tr>
            <td
              className='border bg-table-header px-4 py-3 text-center font-bold'
              colSpan={2}
            >
              TỔNG
            </td>
            {levelsData!.flatMap((lv) =>
              questionTypesData!.map((qt) => (
                <td
                  key={`total_${lv.id}_${qt.id}`}
                  className='border bg-table-total px-3 py-3 text-center'
                />
              ))
            )}
            {questionTypesData!.map((qt) => (
              <td
                key={`total_sum_${qt.id}`}
                className='border bg-table-total px-3 py-3 text-center font-bold'
              >
                {totalByQuestionType[qt.name]}
              </td>
            ))}
            <td className='border bg-table-total px-3 py-3 text-center font-bold text-destructive'>
              {totalAll}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
