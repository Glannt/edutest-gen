package com.dotnt.server.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamMatrixDetailRequest {
    private Long examId;
    private Long matrixId;
    private Long questionTypeId;
    private Integer quantity;
    private Double score;
}
