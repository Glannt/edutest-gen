package com.dotnt.server.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "subjects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Subject extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Chapter> chapters = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "subject_grade", // Tên bảng trung gian
            joinColumns = @JoinColumn(name = "subject_id"), // Khóa ngoại liên kết với Subject
            inverseJoinColumns = @JoinColumn(name = "grade_id") // Khóa ngoại liên kết với Grade
    )
    @Builder.Default
    private Set<Grade> grades = new HashSet<>();
}