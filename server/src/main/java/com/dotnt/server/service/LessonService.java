package com.dotnt.server.service;

import com.dotnt.server.dto.LessonDto;
import com.dotnt.server.dto.response.LessonResponse;
import java.util.List;

public interface LessonService {
    LessonResponse create(LessonDto lessonDto);
    LessonResponse update(Long id, LessonDto lessonDto);
    LessonResponse findById(Long id);
    List<LessonResponse> findAll();
    void deleteById(Long id);
}
