package com.dotnt.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamDto {

    private String title;
    private String description;
    private Integer timeLimit;
    private LocalDateTime createdAt;

    private String subjectName;
    private String gradeName;
    private String difficultyName;
    private String questionTypeName;

    private List<QuestionDto> questions;

    private Integer totalQuestions;
    private Double totalPoints;
}
