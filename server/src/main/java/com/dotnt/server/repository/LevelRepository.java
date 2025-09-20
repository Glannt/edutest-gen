package com.dotnt.server.repository;

import com.dotnt.server.entity.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LevelRepository extends JpaRepository<Level, UUID> {
    Optional<Level> findByName(String name);


    boolean existsByName(String name);
}