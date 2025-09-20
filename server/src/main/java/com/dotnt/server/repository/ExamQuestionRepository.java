package com.dotnt.server.repository;

import com.dotnt.server.entity.ExamQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, UUID> {
}
