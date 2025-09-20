package com.dotnt.server.repository;

import com.dotnt.server.entity.MatrixLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MatrixLessonRepository extends JpaRepository<MatrixLesson, UUID> {
}
