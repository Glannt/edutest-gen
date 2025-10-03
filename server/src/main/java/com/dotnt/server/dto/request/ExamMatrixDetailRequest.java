package com.dotnt.server.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamMatrixDetailRequest {
    private Long matrixId;
    private Long levelId;
    private Integer quantity;
}
