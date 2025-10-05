package com.dotnt.server.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamQuestionResponse {
    private Long questionId;
    private String content;
    private Double finalPoints;
}
