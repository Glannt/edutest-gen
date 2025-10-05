package com.dotnt.server.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "matrix_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatrixDetail extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matrix_id", nullable = false)
    private Matrix matrix;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "level_id", nullable = false)
    private Level level;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="lesson_id")
    private Lesson lesson;

    @Column(name = "question_count", nullable = false)
    @Builder.Default
    private Integer questionCount = 0;

}
