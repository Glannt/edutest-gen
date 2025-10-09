package com.dotnt.server.repository;

import com.dotnt.server.entity.Subject;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByName(String name);

    @Query("SELECT s FROM Subject s WHERE s.name LIKE %:name%")
    @QueryHints({
            @QueryHint(name = org.hibernate.annotations.QueryHints.READ_ONLY, value = "true"),
            @QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true")
    })
    List<Subject> findByNameContaining(@Param("name") String name);

    boolean existsByName(String name);
}
