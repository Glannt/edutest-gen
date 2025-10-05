package com.dotnt.server.repository;

import com.dotnt.server.entity.SubjectGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonGradeRepository extends JpaRepository<SubjectGrade, Long> {
    void deleteByLessonId(Long lessonId);
    List<SubjectGrade> findByGradeId(Long gradeId);
    List<SubjectGrade> findByLessonId(Long lessonId);
    void deleteByGradeId(Long gradeId);
}