package com.dotnt.server.repository;

import com.dotnt.server.entity.Matrix;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MatrixRepository extends JpaRepository<Matrix, UUID> {
}
