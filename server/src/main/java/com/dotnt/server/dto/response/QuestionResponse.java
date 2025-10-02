package com.dotnt.server.dto.response;

import com.dotnt.server.dto.LevelDto;
import com.dotnt.server.dto.OptionDto;
import com.dotnt.server.dto.QuestionTypeDto;
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
public class QuestionResponse {
    private Long id;
    private String content;
    private String explanation;
    private String imageUrl;
    private QuestionTypeDto questionType;
    private LevelDto level;
    private SubjectResponse subject;
    private List<OptionDto> options;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}