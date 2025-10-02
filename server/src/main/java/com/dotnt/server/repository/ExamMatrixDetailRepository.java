package com.dotnt.server.repository;

import com.dotnt.server.entity.ExamMatrixDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamMatrixDetailRepository extends JpaRepository<ExamMatrixDetail, Long> {
}
