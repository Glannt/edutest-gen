package com.dotnt.server.dto.response;

import com.dotnt.server.dto.BaseDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class MatrixDetailResponse extends BaseDto {
    @JsonProperty("level")
    private String levelName;
    @JsonProperty("matrix_name")
    private String matrixName;
    @JsonProperty("lesson_name")
    private String lessonName;
    private Integer quantity;
    private Double percent;

}
