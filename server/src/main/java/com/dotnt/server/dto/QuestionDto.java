package com.dotnt.server.dto;

import com.dotnt.server.entity.Option;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.UUID;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class QuestionDto extends BaseDto {

    @NotBlank(message = "Question content is required")
    private String content;

    private String correctAnswer;

    private String explanation;

    private String imageUrl;


    @NotNull(message = "Lesson ID is required")
    private Long lessonId;

    @NotNull(message = "Difficulty ID is required")
    private Long levelId;

    @NotNull(message = "Question type ID is required")
    private Long questionTypeId;

    private List<OptionDto> options;

    // Additional fields for display
//    private String lessonName;
//    private String difficultyName;
//    private String questionTypeName;
//    private String subjectName;
//    private String gradeName;
//    private String chapterName;
}