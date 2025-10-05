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
    private Long questionId;
    private Double finalPoints; // Nếu null sẽ lấy từ question.level.defaultPoints
}