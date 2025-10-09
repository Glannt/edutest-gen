package com.dotnt.server.repository;

import com.dotnt.server.entity.Matrix;
import com.dotnt.server.entity.Question;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT q FROM Question q WHERE q.lesson.id = :lessonId")
    List<Question> findByLessonId(Long lessonId);

    @Query("""
    SELECT q\s
    FROM Question q\s
    WHERE (q.lesson.id, q.level.id) IN (
        SELECT md.lesson.id, md.level.id\s
        FROM MatrixDetail md\s
        WHERE md.matrix = :matrix
    )
""")
    @QueryHints({
            @QueryHint(name = org.hibernate.annotations.QueryHints.READ_ONLY, value = "true"),
            @QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true")
    })
    List<Question> findByMatrixIncludeLevel(Matrix matrix);
}
