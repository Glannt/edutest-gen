package com.dotnt.server.service.impl;


import com.dotnt.server.dto.LevelDto;
import com.dotnt.server.entity.Level;
import com.dotnt.server.repository.LevelRepository;
import com.dotnt.server.service.LevelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class LevelServiceImpl implements LevelService {

    private final LevelRepository levelRepository;

    @Override
    public List<LevelDto> findAll() {
        return levelRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<LevelDto> findById(Long id) {
        return levelRepository.findById(id).map(this::toDto);
    }

    @Override
    public LevelDto save(LevelDto dto) {
        Level level = toEntity(dto);
        return toDto(levelRepository.save(level));
    }

    @Override
    public LevelDto update(Long id, LevelDto dto) {
        Level existing = levelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Level not found with id " + id));

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setPoints(dto.getPoints());
        // nếu LevelDto có field "level" riêng thì map sang entity field tương ứng (nếu có)

        return toDto(levelRepository.save(existing));
    }

    @Override
    public void deleteById(Long id) {
        if (!levelRepository.existsById(id)) {
            throw new RuntimeException("Level not found with id " + id);
        }
        levelRepository.deleteById(id);
    }

    @Override
    public Page<LevelDto> findAllPaged(Pageable pageable) {
        return levelRepository.findAll(pageable).map(this::toDto);
    }

    // ===================== MAPPING =====================

    private LevelDto toDto(Level entity) {
        return LevelDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .points(entity.getPoints())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private Level toEntity(LevelDto dto) {
        return Level.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .points(dto.getPoints())
                .build();
    }
}
