package com.dotnt.server.service.impl;

import com.dotnt.server.dto.request.MatrixRequest;
import com.dotnt.server.dto.response.ExamMatrixDetailResponse;
import com.dotnt.server.dto.response.MatrixResponse;
import com.dotnt.server.entity.ExamMatrixDetail;
import com.dotnt.server.entity.Matrix;
import com.dotnt.server.repository.LevelRepository;
import com.dotnt.server.repository.MatrixRepository;
import com.dotnt.server.service.MatrixService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatrixServiceImpl implements MatrixService {
    private final MatrixRepository matrixRepository;
    private final LevelRepository levelRepository;

    @Override
    public MatrixResponse save(MatrixRequest matrix) {
        return this.toResponse(matrixRepository.save(this.toEntity(matrix)));
    }

    @Override
    public MatrixResponse findById(Long id) {
        return this.toResponse(matrixRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matrix not found")));
    }

    @Override
    public List<MatrixResponse> findAll() {
        return matrixRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        matrixRepository.deleteById(id);
    }

    @Override
    public MatrixResponse update(Long id,MatrixRequest matrix) {
        Matrix exiting = matrixRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matrix not found with id" + id));
        return this.toResponse(matrixRepository.save(this.toEntity(matrix)));
    }
    private MatrixResponse toResponse(Matrix matrix) {
        return MatrixResponse.builder()
                .id(matrix.getId())
                .name(matrix.getName())
                .description(matrix.getDescription())
                .totalQuestions(matrix.getTotalQuestions())
                .durationMinutes(matrix.getDurationMinutes())
                .matrixDetails(matrix.getExamMatrixDetails().stream()
                        .map(detail -> ExamMatrixDetailResponse.builder()
                                .id(detail.getId())
                                .levelName(detail.getLevel().getName())
                                .matrixName(detail.getMatrix().getName())
                                .percent(matrix.getTotalQuestions() == 0 ? 0d : (detail.getQuestionCount() * 100 / matrix.getTotalQuestions()))
                                .quantity(detail.getQuestionCount())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    private Matrix toEntity(MatrixRequest matrix) {
        return Matrix.builder()
                .name(matrix.getName())
                .description(matrix.getDescription())
                .totalQuestions(matrix.getTotalQuestions())
                .durationMinutes(matrix.getDurationMinutes())
//                .examMatrixDetails(matrix.getMatrixDetails().stream()
//                        .map(detail -> ExamMatrixDetail.builder()
//                                .id(detail.getId())
//                                .level(levelRepository.findById(detail.getLevelId())
//                                        .orElseThrow(() -> new RuntimeException("Level not found with id " + detail.getLevelId())))
//                                .questionCount(detail.getQuantity())
//                                .build())
//                        .collect(Collectors.toList()))
                .build();
    }
}
