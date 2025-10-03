package com.dotnt.server.dto.response;

import com.dotnt.server.dto.BaseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class MatrixResponse extends BaseDto {
    private String name;
    private String description;
    private Integer totalQuestions;
    private Integer durationMinutes;
    private List<ExamMatrixDetailResponse> matrixDetails;
}
