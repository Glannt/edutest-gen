package com.dotnt.server.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MatrixRequest {
    private String name;
    private String description;
    private Integer totalQuestions;
    private Integer durationMinutes;
    private Long userId;
}
