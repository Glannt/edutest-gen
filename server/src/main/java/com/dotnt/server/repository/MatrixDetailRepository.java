package com.dotnt.server.repository;

import com.dotnt.server.entity.MatrixDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MatrixDetailRepository extends JpaRepository<MatrixDetail, Long> {

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END " +
            "FROM MatrixDetail e WHERE e.id = :id")
    boolean existsByMatrixDetailId(@Param("id") Long id);
}
