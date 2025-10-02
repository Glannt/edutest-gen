package com.dotnt.server.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamQuestionRequest {
    private Long examId;
    private Long questionId;
    private Integer orderNumber;
    private Double score;
}