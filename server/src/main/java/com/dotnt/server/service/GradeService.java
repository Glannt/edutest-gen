package com.dotnt.server.service;

import com.dotnt.server.dto.GradeDto;
import com.dotnt.server.dto.response.GradeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface GradeService {
    GradeResponse create(GradeDto gradeDto);
    GradeResponse update(Long id, GradeDto gradeDto);
    GradeResponse findById(Long id);
    Page<GradeResponse> findAllPaged(Pageable pageable);
    void deleteById(Long id);
    List<GradeResponse> findAll();
}