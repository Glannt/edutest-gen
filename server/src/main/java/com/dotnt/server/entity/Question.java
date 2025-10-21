package com.dotnt.server.entity;

import com.dotnt.server.converter.ContentBlockConverter;
import com.dotnt.server.dto.ContentBlockDto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.*;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Question extends BaseEntity {


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonBackReference
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "level_id", nullable = false)
    @JsonBackReference
    private Level level;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_type_id", nullable = false)
    private QuestionType questionType;

//    @Column(nullable = false, columnDefinition = "TEXT")
//    private String content;
//
//    @Column(columnDefinition = "TEXT")
//    private String explanation;

    @Convert(converter = ContentBlockConverter.class)
    @Column(name = "content_json", columnDefinition = "JSON", nullable = false)
    private List<ContentBlockDto> contentJson;

    @Convert(converter = ContentBlockConverter.class)
    @Column(name = "explanation_json", columnDefinition = "JSON")
    private List<ContentBlockDto> explanationJson;


    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private List<Option> options = new LinkedList<>();

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private List<ExamQuestion> examQuestions = new ArrayList<>();
}
