// src/hooks/useGradeSubject.ts
import { useQuery } from '@tanstack/react-query';

import {
  gradeSubjectService,
  ChapterPayload,
} from '@/service/grade-subject.service';
import { SubjectPayload } from '@/types/subject';

/**
 * Lấy danh sách Subject theo Grade
 */
export const useSubjectsByGrade = (gradeId?: number) => {
  return useQuery<SubjectPayload[]>({
    queryKey: ['subjects', gradeId],
    queryFn: () => gradeSubjectService.getSubjectsByGrade(gradeId!),
    enabled: !!gradeId,
  });
};

/**
 * Lấy danh sách Chapter theo Grade + Subject
 */
export const useChaptersByGradeAndSubject = (
  gradeId?: number,
  subjectId?: number
) => {
  return useQuery<ChapterPayload[]>({
    queryKey: ['chapters', gradeId, subjectId],
    queryFn: () =>
      gradeSubjectService.getChaptersByGradeAndSubject(gradeId!, subjectId!),
    enabled: !!gradeId && !!subjectId,
  });
};
