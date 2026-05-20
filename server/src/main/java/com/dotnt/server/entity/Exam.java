package com.dotnt.server.entity;

import com.dotnt.server.converter.ExamQuestionSnapshotConverter;
import com.dotnt.server.dto.ExamQuestionSnapshotDto;
import com.dotnt.server.enums.ExamStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "exams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Exam extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matrix_id", nullable = false)
    private Matrix matrix;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(name = "duration_minutes")
    @Builder.Default
    private Integer durationMinutes = 60;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ExamStatus status = ExamStatus.DRAFT;

    @Convert(converter = ExamQuestionSnapshotConverter.class)
    @Column(name = "questions_json", columnDefinition = "JSON")
    private List<ExamQuestionSnapshotDto> questionsJson;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ExamQuestion> examQuestions = new HashSet<>();

}