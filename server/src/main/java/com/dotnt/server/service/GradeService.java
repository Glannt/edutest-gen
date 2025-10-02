package com.dotnt.server.service;

import com.dotnt.server.dto.GradeDto;
import com.dotnt.server.dto.response.GradeResponse;

import java.util.List;

public interface GradeService {
    GradeResponse create(GradeDto gradeDto);
    GradeResponse update(Long id, GradeDto gradeDto);
    GradeResponse findById(Long id);
    List<GradeResponse> findAll();
    void deleteById(Long id);
    List<GradeResponse> findByLessonId(Long lessonId);
}