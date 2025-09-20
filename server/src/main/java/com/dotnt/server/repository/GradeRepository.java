package com.dotnt.server.repository;

import com.dotnt.server.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GradeRepository extends JpaRepository<Grade, UUID> {
    Optional<Grade> findByName(String name);

    List<Grade> findByLevel(Integer level);

    @Query("SELECT g FROM Grade g JOIN g.subject s WHERE s.id = :subjectId")
    List<Grade> findBySubjectId(@Param("subjectId") UUID subjectId);

    boolean existsByName(String name);
}