package com.dotnt.server.repository;

import com.dotnt.server.entity.Lesson;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {


    @Query("SELECT l FROM Lesson l WHERE l.chapter.id IN :chapterIds")
    @QueryHints({
            @QueryHint(name = org.hibernate.annotations.QueryHints.READ_ONLY, value = "true"),
            @QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true")
    })
    List<Lesson> findByChapterIds(@Param("chapterIds") List<Long> chapterIds);

    boolean existsByNameAndChapterId(String name, Long chapterId);

    @Query("SELECT l FROM Lesson l WHERE l.chapter.id = :chapterId")
    @QueryHints({
            @QueryHint(name = org.hibernate.annotations.QueryHints.READ_ONLY, value = "true"),
            @QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true")
    })
    List<Lesson> findByChapterId(@Param("chapterId") Long chapterId);
}