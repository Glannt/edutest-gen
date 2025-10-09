package com.dotnt.server.dto.request;
import lombok.*;
        import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutoGenerateExamListRequest {
    private String baseCode;            // prefix mã đề (ví dụ: "EXAM2025")
    private String name;                // tên chung của đợt đề thi
    private Long matrixId;
    private int numberOfQuestions;      // số lượng câu hỏi mỗi đề
    private int numberOfExams;          // số lượng đề cần tạo
    private boolean shuffleQuestions;
    private boolean shuffleOptions;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}