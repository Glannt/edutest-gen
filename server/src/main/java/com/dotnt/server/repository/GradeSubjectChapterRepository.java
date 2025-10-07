package com.dotnt.server.repository;

import com.dotnt.server.entity.Chapter;
import com.dotnt.server.entity.GradeSubjectChapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeSubjectChapterRepository extends JpaRepository<GradeSubjectChapter, Long> {

    /**
     * Lấy toàn bộ Chapter của một Grade + Subject
     */
    @Query("""
        SELECT gsc.chapter
        FROM GradeSubjectChapter gsc
        JOIN gsc.gradeSubject gs
        WHERE gs.grade.id = :gradeId AND gs.subject.id = :subjectId
        ORDER BY gsc.orderIndex
    """)
    List<Chapter> findChaptersByGradeAndSubject(
            @Param("gradeId") Long gradeId,
            @Param("subjectId") Long subjectId
    );
}