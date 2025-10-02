package com.dotnt.server.service;

import com.dotnt.server.dto.LevelDto;

import java.util.List;
import java.util.Optional;

public interface LevelService {
    List<LevelDto> findAll();

    Optional<LevelDto> findById(Long id);

    LevelDto save(LevelDto dto);

    LevelDto update(Long id, LevelDto dto);

    void deleteById(Long id);
}
