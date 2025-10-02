package com.dotnt.server.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exam_matrix_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamMatrixDetail extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matrix_id", nullable = false)
    private Matrix matrix;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "level_id", nullable = false)
    private Level level;

    @Column(name = "question_count", nullable = false)
    @Builder.Default
    private Integer questionCount = 0;

}
