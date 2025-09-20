package com.dotnt.server.repository;

import com.dotnt.server.entity.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByChapterIdOrderByOrder(UUID chapterId);

    @Query("SELECT l FROM Lesson l WHERE l.chapter.subject.id = :subjectId AND l.chapter.grade.id = :gradeId")
    List<Lesson> findBySubjectAndGrade(@Param("subjectId") UUID subjectId, @Param("gradeId") UUID gradeId);

    @Query("SELECT l FROM Lesson l WHERE l.chapter.id IN :chapterIds")
    List<Lesson> findByChapterIds(@Param("chapterIds") List<UUID> chapterIds);

    boolean existsByNameAndChapterId(String name, UUID chapterId);
}