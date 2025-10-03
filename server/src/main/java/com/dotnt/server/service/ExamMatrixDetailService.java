package com.dotnt.server.service;

import com.dotnt.server.dto.request.ExamMatrixDetailRequest;
import com.dotnt.server.dto.response.ExamMatrixDetailResponse;
import com.dotnt.server.entity.ExamMatrixDetail;
import java.util.List;

public interface ExamMatrixDetailService {
    ExamMatrixDetailResponse save(ExamMatrixDetailRequest detail);
    ExamMatrixDetailResponse findById(Long id);
    List<ExamMatrixDetailResponse> findAll();
    void deleteById(Long id);
    ExamMatrixDetailResponse update(Long id,ExamMatrixDetailRequest detail);
}
