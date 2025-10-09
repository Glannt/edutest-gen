package com.dotnt.server.service.impl;

import com.dotnt.server.dto.request.MatrixDetailRequest;
import com.dotnt.server.dto.response.MatrixDetailResponse;
import com.dotnt.server.entity.MatrixDetail;
import com.dotnt.server.repository.LessonRepository;
import com.dotnt.server.repository.MatrixDetailRepository;
import com.dotnt.server.repository.LevelRepository;
import com.dotnt.server.repository.MatrixRepository;
import com.dotnt.server.service.MatrixDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatrixDetailServiceImpl implements MatrixDetailService {
    private final MatrixDetailRepository matrixDetailRepository;
    private final LevelRepository levelRepository;
    private final MatrixRepository matrixRepository;
    private final LessonRepository lessonRepository;

    @Override
    public MatrixDetailResponse save(MatrixDetailRequest detail) {
        return this.toResponse(matrixDetailRepository.save(this.toEntity(detail)));
    }

    @Override
    public MatrixDetailResponse findById(Long id) {
        return this.toResponse(matrixDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExamMatrixDetail not found")));
    }

    @Override
    public List<MatrixDetailResponse> findAll() {
        return matrixDetailRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        matrixDetailRepository.deleteById(id);
    }

    @Override
    public MatrixDetailResponse update(Long id, MatrixDetailRequest detail) {
        if (!matrixDetailRepository.existsByMatrixDetailId(id)) {
            throw new RuntimeException("ExamMatrixDetail ID cannot be null for update");
        }
        return this.toResponse(matrixDetailRepository.save(this.toEntity(detail)));
    }

    @Override
    public Page<MatrixDetailResponse> getPaged(Pageable pageable) {
        return matrixDetailRepository.findAll(pageable)
                .map(this::toResponse);
    }

    private MatrixDetailResponse toResponse(MatrixDetail detail) {
        return MatrixDetailResponse.builder()
                .id(detail.getId())
                .matrixName(detail.getMatrix().getName())
                .percent((double) (detail.getQuestionCount() * 100 / detail.getMatrix().getTotalQuestions()))
//                .lessonName(detail.getLesson().getName())
//                .levelName(detail.getLevel().getName())
                .quantity(detail.getQuestionCount())
                .build();
    }

    private MatrixDetail toEntity(MatrixDetailRequest detail) {
        return MatrixDetail.builder()
                .questionCount(detail.getQuantity())
                .level(levelRepository.findById(detail.getLevelId())
                        .orElseThrow(() -> new RuntimeException("Level not found with id" + detail.getLevelId())))
                .matrix(matrixRepository.findById(detail.getMatrixId())
                        .orElseThrow(() -> new RuntimeException("Matrix not found with id" + detail.getMatrixId())))
                .lesson(lessonRepository.findById(detail.getLessonId())
                        .orElseThrow(() -> new RuntimeException("Lesson not found with id" + detail.getLessonId())))
                .questionCount(detail.getQuantity())
                .build();
    }
}
