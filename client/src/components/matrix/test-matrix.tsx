import React, { useMemo } from 'react';

import { useMatrixStore } from '@/store/matrix.store';
import { useMatrixSummary } from '@/hooks/useMatrixSummary';
import { useLevels } from '@/hooks/useLevels';
import { useQuestionTypes } from '@/hooks/useQuestionTypes';
import { useEntityNameMap } from '@/hooks/useEntityNameMap';
import { useChapters } from '@/hooks/useChapter';
import { useLessons } from '@/hooks/useLesson';

export const TestMatrixDynamic = () => {
  const structures = useMatrixStore((s) => s.structures);
  const matrixInfo = useMatrixStore((s) => s.matrixInfo);
  const summary = useMatrixSummary();

  const { data: levels = [] } = useLevels();
  const { data: questionTypes = [] } = useQuestionTypes();
  const { data: chapters = [] } = useChapters();
  const { data: lessons = [] } = useLessons();

  const chapterNameMap = useEntityNameMap(chapters);
  const lessonNameMap = useEntityNameMap(lessons);

  // Gom theo chương
  const chapterGroups = useMemo(() => {
    const map = new Map<number | string, typeof structures>();

    structures.forEach((it) => {
      const key = it.chapterId ?? `chapter_${it.chapterId ?? 'unknown'}`;

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    });

    return map;
  }, [structures]);

  // Hàm tính tổng số câu theo từng loại câu hỏi của một row
  const countByQuestionType = (lessonItems: typeof structures) => {
    const result: Record<number, number> = {};

    questionTypes.forEach((qt) => (result[qt.id] = 0));

    lessonItems.forEach((it) => {
      if (it.questionTypeId != null) {
        result[it.questionTypeId] += it.questionCount || 0;
      }
    });

    return result;
  };

  // Hàm tính tổng điểm (ở đây tạm tính = tổng số câu)
  const calcTotalScore = (lessonItems: typeof structures) =>
    lessonItems.reduce((sum, it) => sum + (it.questionCount || 0), 0);

  return (
    <div className='w-full overflow-x-auto'>
      <table className='w-full border-collapse text-sm'>
        {/* === HEADER === */}
        <thead>
          <tr>
            <th
              className='border px-4 py-3 '
              rowSpan={3}
            >
              CHƯƠNG
            </th>
            <th
              className='border px-4 py-3 '
              rowSpan={3}
            >
              NỘI DUNG / BÀI HỌC
            </th>

            <th
              className='border px-4 py-3 '
              colSpan={levels.length * questionTypes.length}
            >
              MỨC ĐỘ NHẬN THỨC
            </th>

            <th
              className='border px-4 py-3 '
              colSpan={questionTypes.length}
            >
              TỔNG SỐ CÂU HỎI
            </th>

            <th
              className='border px-4 py-3 '
              rowSpan={3}
            >
              % TỔNG ĐIỂM
            </th>
          </tr>

          <tr>
            {levels.map((lv) => (
              <th
                key={lv.id}
                className='border px-3 py-2 text-center'
                colSpan={questionTypes.length}
              >
                {lv.name}
              </th>
            ))}

            {questionTypes.map((qt) => (
              <th
                key={qt.id}
                className='border px-3 py-2 text-center'
                rowSpan={2}
              >
                {qt.name}
              </th>
            ))}
          </tr>

          <tr>
            {levels.map((lv) =>
              questionTypes.map((qt) => (
                <th
                  key={`${lv.id}_${qt.id}`}
                  className='border px-3 py-2 text-center text-xs '
                >
                  {qt.name}
                </th>
              ))
            )}
          </tr>
        </thead>

        {/* === BODY === */}
        <tbody>
          {Array.from(chapterGroups.entries()).map(([chapterKey, items]) => {
            const byLesson = new Map<number | string, typeof structures>();

            items.forEach((it) => {
              const k = it.lessonId ?? `lesson_${it.lessonId ?? 'unknown'}`;

              if (!byLesson.has(k)) byLesson.set(k, []);
              byLesson.get(k)!.push(it);
            });

            const chapterName = chapterNameMap[items[0]?.chapterId ?? 0] || '—';
            const chapterRowSpan = Array.from(byLesson.keys()).length;

            return Array.from(byLesson.entries()).map(
              ([lessonKey, lessonItems], idx) => {
                const lessonName =
                  lessonNameMap[lessonItems[0]?.lessonId ?? 0] || '—';
                const typeCounts = countByQuestionType(lessonItems);
                const totalScore = calcTotalScore(lessonItems);

                return (
                  <tr key={`${chapterKey}_${lessonKey}`}>
                    {/* ✅ In cột CHƯƠNG chỉ một lần đầu tiên của mỗi nhóm */}
                    {idx === 0 && (
                      <td
                        className='border px-3 py-2 text-center align-middle font-medium'
                        rowSpan={chapterRowSpan}
                      >
                        {chapterName}
                      </td>
                    )}

                    {/* Cột bài học */}
                    <td className='border px-3 py-2'>{lessonName}</td>

                    {/* Các cột động */}
                    {levels.map((lv) =>
                      questionTypes.map((qt) => {
                        const found = lessonItems.find(
                          (it) =>
                            it.levelId === lv.id && it.questionTypeId === qt.id
                        );

                        return (
                          <td
                            key={`${lessonKey}_${lv.id}_${qt.id}`}
                            className='border px-3 py-2 text-center'
                          >
                            {found ? found.questionCount : ''}
                          </td>
                        );
                      })
                    )}

                    {/* Tổng theo questionType */}
                    {questionTypes.map((qt) => (
                      <td
                        key={`sum_${lessonKey}_${qt.id}`}
                        className='border px-3 py-2 text-center font-semibold '
                      >
                        {typeCounts[qt.id] || ''}
                      </td>
                    ))}

                    {/* Tổng điểm */}
                    <td className='border px-3 py-2 text-center font-bold '>
                      {matrixInfo
                        ? `${((totalScore / matrixInfo.totalQuestions) * 100).toFixed(0)}%`
                        : totalScore}
                    </td>
                  </tr>
                );
              }
            );
          })}

          {/* === Dòng tổng cuối === */}
          <tr className='font-bold '>
            <td
              className='border px-3 py-2 text-center'
              colSpan={2}
            >
              TỔNG
            </td>

            {levels.map((lv) =>
              questionTypes.map((qt) => {
                const key = `${lv.id}_${qt.id}`;
                const v = summary.totalsByLevelQuestionType[key] ?? 0;

                return (
                  <td
                    key={key}
                    className='border px-3 py-2 text-center'
                  >
                    {v || ''}
                  </td>
                );
              })
            )}

            {questionTypes.map((qt) => {
              const totalByQT = summary.uniqueLevelQuestionPairs
                .filter((p) => p.questionTypeId === qt.id)
                .reduce((a, b) => a + b.count, 0);

              return (
                <td
                  key={`qt_sum_${qt.id}`}
                  className='border px-3 py-2 text-center'
                >
                  {totalByQT || ''}
                </td>
              );
            })}

            <td className='border px-3 py-2 text-center '>
              {summary.totalQuestions}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
