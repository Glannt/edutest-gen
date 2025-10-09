package com.dotnt.server.dto.request;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutoGenerateExamRequest {
    private String code;
    private String name;
    private Long matrixId;
    private int numberOfQuestions;     // số lượng câu hỏi muốn sinh
    private boolean shuffleQuestions;  // có trộn thứ tự câu hỏi không
    private boolean shuffleOptions;    // có trộn thứ tự option không
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
