package com.dotnt.server.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MatrixRequest {
    private String name;
    private String description;
    private Integer totalQuestions;
    private Double totalScore;
    private List<MatrixDetailRequest> matrixDetails;
    private Long userId;
}
