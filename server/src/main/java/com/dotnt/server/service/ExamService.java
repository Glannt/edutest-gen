package com.dotnt.server.service;

import com.dotnt.server.dto.request.CreateExamRequest;
import com.dotnt.server.dto.response.ExamResponse;
import com.dotnt.server.entity.Exam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ExamService {
    ExamResponse createExam(CreateExamRequest request);

    ExamResponse getExam(Long examId);

    ExamResponse updateExam(Long examId, CreateExamRequest request);

    void deleteExam(Long examId);

    Page<ExamResponse> getPaged(Pageable pageable);
}
