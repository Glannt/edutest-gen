package com.dotnt.server.dto.response;

import com.dotnt.server.dto.LevelDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamResponse {
    private UUID id;
    private String title;
    private String description;
    private String status;
    private SubjectResponse subject;
    private GradeResponse grade;
    private LessonResponse lesson;
    private LevelDto difficulty;
    private List<QuestionResponse> questions;
    private Integer totalQuestions;
    private LocalDateTime createdAt;
}
