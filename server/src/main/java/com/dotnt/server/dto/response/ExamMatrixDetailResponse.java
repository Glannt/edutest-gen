package com.dotnt.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamMatrixDetailResponse {
    private Long id;
    private Long examId;
    private Long matrixId;
    private Long questionTypeId;
    private Integer quantity;
    private Double score;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
