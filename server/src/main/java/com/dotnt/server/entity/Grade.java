package com.dotnt.server.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(
        name = "grades",
        indexes = {
                @Index(name = "idx_grade_name", columnList = "name")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Grade extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "level")
    private Integer level;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String created_by;

    @OneToMany(mappedBy = "grade", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<GradeSubject> gradeSubjects = new HashSet<>();
}
