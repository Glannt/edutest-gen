package com.dotnt.server.service;

import com.dotnt.server.dto.QuestionDto;
import com.dotnt.server.dto.response.QuestionResponse;

import java.util.List;
import java.util.Optional;

public interface QuestionService {
    QuestionResponse save(QuestionDto question);
    Optional<QuestionResponse> findById(Long id);
    List<QuestionResponse> findAll();
    void deleteById(Long id);
    QuestionResponse update(Long id, QuestionDto question);
}
