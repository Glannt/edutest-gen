package com.dotnt.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class LessonDto extends BaseDto {

    @NotBlank(message = "Lesson name is required")
    private String name;

    private String description;

    private Integer orderIndex;

    private Long chapterId;

    private List<Long> gradeIds;

}
