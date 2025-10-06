// src/service/grade-subject.service.ts
import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { SubjectPayload } from '@/types/subject';

export interface ChapterPayload {
  id: number;
  name: string;
  description?: string;
  orderIndex: number;
}

export const gradeSubjectService = {
  /**
   * Lấy danh sách subject theo grade
   */
  async getSubjectsByGrade(gradeId: number): Promise<SubjectPayload[]> {
    const res = await http.get<ApiResponse<SubjectPayload[]>>(
      `/grades/${gradeId}/subjects`
    );

    return res.data.data ?? res.data;
  },

  /**
   * Lấy danh sách chapter theo grade + subject
   */
  async getChaptersByGradeAndSubject(
    gradeId: number,
    subjectId: number
  ): Promise<ChapterPayload[]> {
    const res = await http.get<ApiResponse<ChapterPayload[]>>(
      `/grades/${gradeId}/subjects/${subjectId}/chapters`
    );

    return res.data.data ?? res.data;
  },
};
