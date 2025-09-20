package com.dotnt.server.repository;

import com.dotnt.server.entity.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QuestionTypeRepository extends JpaRepository<QuestionType, UUID> {
}
