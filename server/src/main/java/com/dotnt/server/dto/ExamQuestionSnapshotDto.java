package com.dotnt.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamQuestionSnapshotDto {
    private Long questionId;
    private List<ContentBlockDto> contentJson;
    private List<ContentBlockDto> explanationJson;
    private Double finalPoints;
    private List<OptionDto> options;
}
