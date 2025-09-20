package com.dotnt.server.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamQuestionId implements Serializable {

    @Column(name = "exam_id")
    private Long examId;

    @Column(name = "question_id")
    private Long questionId;
}
