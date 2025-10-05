package com.dotnt.server.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatrixDetailRequest {
    private Long matrixId;
    private Long levelId;
    private Long lessonId;
    private Integer quantity;
}
