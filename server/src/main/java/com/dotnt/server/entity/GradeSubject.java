package com.dotnt.server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
        name = "grade_subject",
        uniqueConstraints = @UniqueConstraint(columnNames = {"grade_id", "subject_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class GradeSubject extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grade_id", nullable = false)
    private Grade grade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @OneToMany(mappedBy = "gradeSubject", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<GradeSubjectChapter> gradeSubjectChapters = new HashSet<>();
}