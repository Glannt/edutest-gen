package com.dotnt.server.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "levels")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Level extends BaseEntity {

    @Column(nullable = false, length = 50)
    private String name;

    private String description;

    @Column(name = "points", precision = 5, scale = 2)
    private BigDecimal points;

    @OneToMany(mappedBy = "level", cascade = CascadeType.ALL)
    @Builder.Default
    @JsonManagedReference
    private Set<Question> questions = new HashSet<>();

    @OneToMany(mappedBy = "level", cascade = CascadeType.ALL)
    @Builder.Default
    @JsonManagedReference
    private Set<ExamMatrixDetail> examMatrixDetails = new HashSet<>();
}
