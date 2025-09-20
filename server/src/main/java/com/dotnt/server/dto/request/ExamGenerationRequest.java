package com.dotnt.server.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamGenerationRequest {

    @NotNull(message = "Subject ID is required")
    private UUID subjectId;

    @NotNull(message = "Grade ID is required")
    private UUID gradeId;

    private List<UUID> lessonIds; // Optional, if empty will use all lessons

    @NotNull(message = "Difficulty ID is required")
    private UUID difficultyId;

    @NotNull(message = "Question type ID is required")
    private UUID questionTypeId;

    @NotNull(message = "Number of questions is required")
    @Min(value = 1, message = "Number of questions must be at least 1")
    private Integer numberOfQuestions;

    private String examTitle;
    private String examDescription;
    private Integer timeLimit; // in minutes
}