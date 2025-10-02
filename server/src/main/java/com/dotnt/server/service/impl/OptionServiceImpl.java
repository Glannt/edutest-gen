package com.dotnt.server.service.impl;


import com.dotnt.server.dto.OptionDto;
import com.dotnt.server.entity.Option;
import com.dotnt.server.repository.OptionRepository;
import com.dotnt.server.service.OptionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OptionServiceImpl implements OptionService {
    private final OptionRepository optionRepository;

    @Override
    public OptionDto save(OptionDto optionDto) {
        Option option = toEntity(optionDto);
        Option saved = optionRepository.save(option);
        return toDto(saved);
    }

    @Override
    public Optional<OptionDto> findById(Long id) {
        Option option = optionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Option not found with id " + id));
        return Optional.ofNullable(toDto(option));
    }

    @Override
    public List<OptionDto> findAll() {
        return optionRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        if (!optionRepository.existsById(id)) {
            throw new EntityNotFoundException("Option not found with id " + id);
        }
        optionRepository.deleteById(id);
    }

    @Override
    public OptionDto update(Long id, OptionDto optionDto) {
        Option existing = optionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Option not found with id " + id));

        // Update fields
        existing.setContent(optionDto.getContent());
        existing.setIsCorrect(optionDto.getIsCorrect());
        existing.setOrderIndex(optionDto.getOrderIndex());
        existing.setUpdatedAt(LocalDateTime.now());

        Option saved = optionRepository.save(existing);
        return toDto(saved);
    }

    private OptionDto toDto(Option option) {
        return OptionDto.builder()
                .id(option.getId())
                .content(option.getContent())
                .isCorrect(option.getIsCorrect())
                .orderIndex(option.getOrderIndex())
                .createdAt(option.getCreatedAt())
                .updatedAt(option.getUpdatedAt())
                .build();
    }

    private Option toEntity(OptionDto dto) {
        Option option = new Option();
        option.setId(dto.getId());
        option.setContent(dto.getContent());
        option.setIsCorrect(dto.getIsCorrect());
        option.setOrderIndex(dto.getOrderIndex());
        option.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now());
        option.setUpdatedAt(LocalDateTime.now());
        return option;
    }
}