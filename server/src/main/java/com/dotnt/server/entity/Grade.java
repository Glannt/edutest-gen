package com.dotnt.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "grades")
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

    @ManyToMany(mappedBy = "grades")
    @Builder.Default
    private Set<Subject> subjects = new HashSet<>();
}
