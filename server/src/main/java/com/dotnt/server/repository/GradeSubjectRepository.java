package com.dotnt.server.repository;

import com.dotnt.server.entity.Grade;
import com.dotnt.server.entity.GradeSubject;
import com.dotnt.server.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeSubjectRepository extends JpaRepository<GradeSubject, Long> {

    /**
     * Lấy toàn bộ Subject thuộc về một Grade
     */
    @Query("""
        SELECT gs.subject
        FROM GradeSubject gs
        WHERE gs.grade.id = :gradeId
    """)
    List<Subject> findSubjectsByGradeId(@Param("gradeId") Long gradeId);

    /**
     * Lấy ra GradeSubject cụ thể cho một Grade và Subject
     */
    @Query("""
        SELECT gs
        FROM GradeSubject gs
        WHERE gs.grade.id = :gradeId AND gs.subject.id = :subjectId
    """)
    GradeSubject findByGradeIdAndSubjectId(@Param("gradeId") Long gradeId, @Param("subjectId") Long subjectId);

    boolean existsByGradeAndSubject(Grade grade, Subject subject);

    void deleteByGradeAndSubject(Grade grade, Subject subject);
    List<GradeSubject> findBySubjectId(Long subjectId);
}
