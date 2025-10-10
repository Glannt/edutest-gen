package com.dotnt.server.dto.response;

import com.dotnt.server.dto.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class QuestionResponse extends BaseDto {
    private List<ContentBlockDto> contentJson;
    private List<ContentBlockDto> explanationJson;
    private String imageUrl;
    private QuestionTypeDto questionType;
    private LevelDto level;
    private SubjectResponse subject;
    private List<OptionDto> options;
    private Boolean isActive;
}