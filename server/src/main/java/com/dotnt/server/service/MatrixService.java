package com.dotnt.server.service;

import com.dotnt.server.dto.request.MatrixRequest;
import com.dotnt.server.dto.response.MatrixResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

public interface MatrixService {
    MatrixResponse save(MatrixRequest matrix);
    MatrixResponse findById(Long id);
    Page<MatrixResponse> findAll(Pageable pageable);
    void deleteById(Long id);
    MatrixResponse update(Long id, MatrixRequest matrix);
    ByteArrayInputStream exportMatrixToExcel(Long matrixId) throws IOException;
    ByteArrayInputStream exportMultipleMatrixToZip(List<Long> matrixIds) throws IOException;
    List<MatrixResponse> findByGradeAndSubject(Long gradeId, Long subjectId);
    List<MatrixResponse> findAll();
}
