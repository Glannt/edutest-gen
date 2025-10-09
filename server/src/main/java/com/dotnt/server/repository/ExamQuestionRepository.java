package com.dotnt.server.repository;

import com.dotnt.server.entity.ExamQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM ExamQuestion eq WHERE eq.exam.id = :examId")
    void deleteByExamId(Long examId);
}
