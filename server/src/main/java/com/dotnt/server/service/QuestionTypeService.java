package com.dotnt.server.service;

import com.dotnt.server.dto.QuestionTypeDto;

import java.util.List;
import java.util.Optional;

public interface QuestionTypeService {
    List<QuestionTypeDto> findAll();

    Optional<QuestionTypeDto> findById(Long id);

    QuestionTypeDto save(QuestionTypeDto dto);

    QuestionTypeDto update(Long id, QuestionTypeDto dto);

    void deleteById(Long id);
}
