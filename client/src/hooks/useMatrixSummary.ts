import { useMemo } from 'react';

import { useMatrixStore } from '@/store/matrix.store';

export const useMatrixSummary = () => {
  const structures = useMatrixStore((s) => s.structures);

  return useMemo(() => {
    const totalsBySubjectId: Record<number, number> = {};
    const totalsByLevelId: Record<number, number> = {};
    const totalsByLevelQuestionType: Record<string, number> = {};
    const totalsByQuestionType: Record<number, number> = {};
    let totalQuestions = 0;

    structures.forEach((it) => {
      const count = Number(it.questionCount) || 0;

      totalQuestions += count;

      if (it.subjectId)
        totalsBySubjectId[it.subjectId] =
          (totalsBySubjectId[it.subjectId] || 0) + count;

      if (it.levelId)
        totalsByLevelId[it.levelId] =
          (totalsByLevelId[it.levelId] || 0) + count;

      if (it.levelId && it.questionTypeId) {
        const key = `${it.levelId}_${it.questionTypeId}`;

        totalsByLevelQuestionType[key] =
          (totalsByLevelQuestionType[key] || 0) + count;
      }
      if (it.questionTypeId != null) {
        totalsByQuestionType[it.questionTypeId] =
          (totalsByQuestionType[it.questionTypeId] || 0) + count;
      }
    });

    const uniqueSubjectIds = Object.keys(totalsBySubjectId).map(Number);
    const uniqueLevelIds = Object.keys(totalsByLevelId).map(Number);
    const uniqueLevelQuestionPairs = Object.entries(
      totalsByLevelQuestionType
    ).map(([key, count]) => {
      const [levelId, questionTypeId] = key.split('_').map(Number);

      return { levelId, questionTypeId, count };
    });

    return {
      totalsBySubjectId,
      totalsByLevelId,
      totalsByLevelQuestionType,
      totalQuestions,
      uniqueSubjectIds,
      uniqueLevelIds,
      uniqueLevelQuestionPairs,
      totalsByQuestionType,
      structures,
    };
  }, [structures]);
};
