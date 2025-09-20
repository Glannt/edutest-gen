package com.dotnt.server.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "matrix_lesson")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatrixLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantity_question", nullable = false)
    private Integer quantityQuestion;

    // Lưu ý: Trường 'level' ở đây nên là một khóa ngoại (FK)
    // đến bảng 'Level' thay vì một chuỗi, để đảm bảo tính toàn vẹn dữ liệu.
    @Column(name = "level")
    private String level;

    @Column(name = "weight_percent", precision = 5, scale = 2)
    private BigDecimal weightPercent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matrix_id")
    private Matrix matrix;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
}
