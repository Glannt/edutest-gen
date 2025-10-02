package com.dotnt.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamQuestionResponse {
    private Long id;
    private Long examId;
    private Long questionId;
    private Integer orderNumber;
    private Double score;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
