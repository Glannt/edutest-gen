package com.dotnt.server.repository;

import com.dotnt.server.entity.LessonGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonGradeRepository extends JpaRepository<LessonGrade, Long> {
    void deleteByLessonId(Long lessonId);
    List<LessonGrade> findByGradeId(Long gradeId);
    List<LessonGrade> findByLessonId(Long lessonId);
    void deleteByGradeId(Long gradeId);
}