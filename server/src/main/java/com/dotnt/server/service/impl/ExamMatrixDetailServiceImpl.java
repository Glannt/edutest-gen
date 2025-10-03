package com.dotnt.server.service.impl;

import com.dotnt.server.dto.request.ExamMatrixDetailRequest;
import com.dotnt.server.dto.response.ExamMatrixDetailResponse;
import com.dotnt.server.entity.ExamMatrixDetail;
import com.dotnt.server.repository.ExamMatrixDetailRepository;
import com.dotnt.server.repository.LevelRepository;
import com.dotnt.server.repository.MatrixRepository;
import com.dotnt.server.service.ExamMatrixDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamMatrixDetailServiceImpl implements ExamMatrixDetailService {
    private final ExamMatrixDetailRepository examMatrixDetailRepository;
    private final LevelRepository levelRepository;
    private final MatrixRepository matrixRepository;

    @Override
    public ExamMatrixDetailResponse save(ExamMatrixDetailRequest detail) {
        return this.toResponse(examMatrixDetailRepository.save(this.toEntity(detail)));
    }

    @Override
    public ExamMatrixDetailResponse findById(Long id) {
        return this.toResponse(examMatrixDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExamMatrixDetail not found")));
    }

    @Override
    public List<ExamMatrixDetailResponse> findAll() {
        return examMatrixDetailRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        examMatrixDetailRepository.deleteById(id);
    }

    @Override
    public ExamMatrixDetailResponse update(Long id, ExamMatrixDetailRequest detail) {
        if (!examMatrixDetailRepository.existsByExamMatrixDetailId(id)) {
            throw new RuntimeException("ExamMatrixDetail ID cannot be null for update");
        }
        return this.toResponse(examMatrixDetailRepository.save(this.toEntity(detail)));
    }

    private ExamMatrixDetailResponse toResponse(ExamMatrixDetail detail) {
        return ExamMatrixDetailResponse.builder()
                .matrixName(detail.getMatrix().getName())
                .percent((double) (detail.getQuestionCount() * 100 / detail.getMatrix().getTotalQuestions()))
                .id(detail.getId())
                .quantity(detail.getQuestionCount())
                .build();
    }

    private ExamMatrixDetail toEntity(ExamMatrixDetailRequest detail) {
        return ExamMatrixDetail.builder()
                .questionCount(detail.getQuantity())
                .level(levelRepository.findById(detail.getLevelId())
                        .orElseThrow(() -> new RuntimeException("Level not found with id" + detail.getLevelId())))
                .matrix(matrixRepository.findById(detail.getMatrixId())
                        .orElseThrow(() -> new RuntimeException("Matrix not found with id" + detail.getMatrixId())))
                .build();
    }
}
