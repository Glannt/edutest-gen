package com.dotnt.server.service.impl;

import com.dotnt.server.dto.QuestionTypeDto;
import com.dotnt.server.entity.QuestionType;
import com.dotnt.server.repository.QuestionTypeRepository;
import com.dotnt.server.service.QuestionTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionTypeServiceImpl implements QuestionTypeService {
    private final QuestionTypeRepository questionTypeRepository;

    @Override
    public List<QuestionTypeDto> findAll() {
        return questionTypeRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<QuestionTypeDto> findById(Long id) {
        return questionTypeRepository.findById(id).map(this::toDto);
    }

    @Override
    public QuestionTypeDto save(QuestionTypeDto dto) {
        QuestionType entity = toEntity(dto);
        return toDto(questionTypeRepository.save(entity));
    }

    @Override
    public QuestionTypeDto update(Long id, QuestionTypeDto dto) {
        QuestionType existing = questionTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("QuestionType not found with id " + id));

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());

        return toDto(questionTypeRepository.save(existing));
    }

    @Override
    public void deleteById(Long id) {
        if (!questionTypeRepository.existsById(id)) {
            throw new RuntimeException("QuestionType not found with id " + id);
        }
        questionTypeRepository.deleteById(id);
    }

    // ===================== MAPPING =====================

    private QuestionTypeDto toDto(QuestionType entity) {
        return QuestionTypeDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private QuestionType toEntity(QuestionTypeDto dto) {
        return QuestionType.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
    }
}