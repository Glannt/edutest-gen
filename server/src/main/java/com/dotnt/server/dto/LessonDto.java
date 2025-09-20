package com.dotnt.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class LessonDto extends BaseDto {

    @NotBlank(message = "Lesson name is required")
    private String name;

    private String description;

    private Integer order;

    @NotNull(message = "Chapter ID is required")
    private Long chapterId;

    private String chapterName;
    private String subjectName;
    private String gradeName;
}
