package com.dotnt.server.repository;

import com.dotnt.server.entity.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {
    Optional<Subject> findByName(String name);

    @Query("SELECT s FROM Subject s WHERE s.name LIKE %:name%")
    List<Subject> findByNameContaining(@Param("name") String name);

    @Query("SELECT s FROM Subject s JOIN s.grades g WHERE g.id = :gradeId")
    List<Subject> findByGradeId(@Param("gradeId") UUID gradeId);

    boolean existsByName(String name);
}
