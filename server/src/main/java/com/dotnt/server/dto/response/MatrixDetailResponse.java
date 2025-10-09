package com.dotnt.server.dto.response;

import com.dotnt.server.dto.BaseDto;
import com.dotnt.server.dto.LevelDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class MatrixDetailResponse extends BaseDto {

    @JsonProperty("chapter_name")
    private String chapterName;        // mới thêm để nhóm theo chương

    @JsonProperty("lesson")
    private LessonResponse lesson;

    @JsonProperty("level")
    private LevelDto level;          // giữ nguyên

    @JsonProperty("question_type_name")
    private String questionType;       // mới thêm để map với questionTypes

    private Integer quantity;

    private Double percent;

    @JsonProperty("matrix_name")
    private String matrixName;         // giữ để tham chiếu

}
