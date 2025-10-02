package com.dotnt.server.repository;

import com.dotnt.server.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    Optional<Grade> findByName(String name);

    Grade findByLevel(Integer level);

    void deleteById(Long id);

    boolean existsByName(String name);
}