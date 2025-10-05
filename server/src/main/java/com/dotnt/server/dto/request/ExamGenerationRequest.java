package com.dotnt.server.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamGenerationRequest {

    @NotNull(message = "Grade ID is required")
    private Long gradeId;

    @NotNull(message = "Difficulty ID is required")
    private Long levelId;

    @NotNull(message = "Question type ID is required")
    private Long questionTypeId;

    @NotNull(message = "Number of questions is required")
    @Min(value = 1, message = "Number of questions must be at least 1")
    private Integer numberOfQuestions;

    private String examTitle;
    private String examDescription;
    private Integer timeLimit; // in minutes
}