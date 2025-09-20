package com.dotnt.server.dto.response;

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
public class QuestionResponse {
    private UUID id;
    private String text;
    private String imageUrl;
    private QuestionTypeResponse questionType;
    private DifficultyResponse difficulty;
    private SubjectResponse subject;
    private LessonResponse lesson;
    private List<AnswerResponse> answers;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}