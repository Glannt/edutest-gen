package com.dotnt.server.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class QuestionDto extends BaseDto {

    @NotBlank(message = "Question content is required")
    private String content;

    private String correctAnswer;

    private String explanation;

    private String imageUrl;

    private Double points = 1.0;

    @NotNull(message = "Lesson ID is required")
    private UUID lessonId;

    @NotNull(message = "Difficulty ID is required")
    private UUID difficultyId;

    @NotNull(message = "Question type ID is required")
    private UUID questionTypeId;

    private List<QuestionOptionDto> options;

    // Additional fields for display
    private String lessonName;
    private String difficultyName;
    private String questionTypeName;
    private String subjectName;
    private String gradeName;
    private String chapterName;
}