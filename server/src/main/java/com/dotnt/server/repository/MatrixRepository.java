package com.dotnt.server.repository;

import com.dotnt.server.entity.Matrix;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatrixRepository extends JpaRepository<Matrix, Long> {
    // 1. Lấy tất cả matrix theo gradeId
    @Query("""
        select distinct m 
        from Matrix m
        join m.matrixDetails md
        join md.lesson l
        join l.chapter c
        join GradeSubjectChapter gsc on gsc.chapter = c
        join gsc.gradeSubject gs
        join gs.grade g
        where g.id = :gradeId
    """)
    List<Matrix> findByGradeId(@Param("gradeId") Long gradeId);

    // 2. Lấy matrix theo gradeId và subjectId
    @Query("""
        select distinct m 
        from Matrix m
        join m.matrixDetails md
        join md.lesson l
        join l.chapter c
        join GradeSubjectChapter gsc on gsc.chapter = c
        join gsc.gradeSubject gs
        join gs.grade g
        join gs.subject s
        where g.id = :gradeId and s.id = :subjectId
    """)
    @QueryHints({
            @QueryHint(name = org.hibernate.annotations.QueryHints.READ_ONLY, value = "true"),
            @QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true")
    })
    List<Matrix> findByGradeIdAndSubjectId(@Param("gradeId") Long gradeId,
                                           @Param("subjectId") Long subjectId);
}
