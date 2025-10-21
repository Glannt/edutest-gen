package com.dotnt.server.service;

import com.dotnt.server.dto.LevelDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface LevelService {
    List<LevelDto> findAll();

    Optional<LevelDto> findById(Long id);

    LevelDto save(LevelDto dto);

    LevelDto update(Long id, LevelDto dto);

    void deleteById(Long id);

    Page<LevelDto> findAllPaged(Pageable pageable);
}
