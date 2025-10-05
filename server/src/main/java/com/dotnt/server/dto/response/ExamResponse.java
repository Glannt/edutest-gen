package com.dotnt.server.dto.response;

import com.dotnt.server.dto.BaseDto;
import com.dotnt.server.dto.LevelDto;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ExamResponse extends BaseDto {
    private String code;
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<ExamQuestionResponse> questions;
}
