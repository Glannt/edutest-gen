package com.dotnt.server.dto.response;

import com.dotnt.server.dto.BaseDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ExamMatrixDetailResponse extends BaseDto {
    @JsonProperty("level")
    private String levelName;
    @JsonProperty("matrix_name")
    private String matrixName;
    private Integer quantity;
    private Double percent;

}
