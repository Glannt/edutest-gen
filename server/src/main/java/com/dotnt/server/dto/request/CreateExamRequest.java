package com.dotnt.server.dto.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateExamRequest {
    private String code;
    private String name;
    private Long matrixId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<ExamQuestionRequest> questions; // List câu hỏi
    private boolean shuffleQuestions; // shuffle nếu true
}
