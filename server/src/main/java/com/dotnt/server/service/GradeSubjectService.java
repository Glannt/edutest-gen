package com.dotnt.server.service;

import com.dotnt.server.dto.SubjectDto;
import com.dotnt.server.dto.response.ChapterResponse;
import com.dotnt.server.entity.Chapter;
import com.dotnt.server.entity.Subject;

import java.util.List;

public interface GradeSubjectService {
    List<SubjectDto> getSubjectsByGrade(Long gradeId);
    List<ChapterResponse> getChaptersByGradeAndSubject(Long gradeId, Long subjectId);
}
