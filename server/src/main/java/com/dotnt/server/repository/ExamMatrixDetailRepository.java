package com.dotnt.server.repository;

import com.dotnt.server.entity.ExamMatrixDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamMatrixDetailRepository extends JpaRepository<ExamMatrixDetail, Long> {

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END " +
            "FROM ExamMatrixDetail e WHERE e.id = :id")
    boolean existsByExamMatrixDetailId(@Param("id") Long id);
}
