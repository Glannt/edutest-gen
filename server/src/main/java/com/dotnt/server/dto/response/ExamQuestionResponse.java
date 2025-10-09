package com.dotnt.server.dto.response;

import com.dotnt.server.dto.OptionDto;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamQuestionResponse {
    private Long questionId;
    private String content;
    private Double finalPoints;
    private List<OptionDto> options;
}
