package com.dotnt.server.dto.response;

import com.dotnt.server.dto.LevelDto;
import com.dotnt.server.dto.QuestionTypeDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResponse {
    private Long id;
    private String text;
    private String imageUrl;
    private QuestionTypeDto questionType;
    private LevelDto level;
    private SubjectResponse subject;
    private LessonResponse lesson;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}