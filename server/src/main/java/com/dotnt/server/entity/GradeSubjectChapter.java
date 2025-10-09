package com.dotnt.server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "grade_subject_chapter",
        uniqueConstraints = @UniqueConstraint(columnNames = {"grade_subject_id", "chapter_id"}),
        indexes = {
                @Index(name = "idx_gsc_grade_subject", columnList = "grade_subject_id"),
                @Index(name = "idx_gsc_chapter", columnList = "chapter_id"),
                @Index(name = "idx_gsc_order", columnList = "order_index")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class GradeSubjectChapter extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grade_subject_id", nullable = false)
    private GradeSubject gradeSubject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;

    @Column(name = "order_index")
    private Integer orderIndex;
}