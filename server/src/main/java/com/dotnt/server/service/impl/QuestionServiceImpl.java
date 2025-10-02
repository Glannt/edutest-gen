package com.dotnt.server.service.impl;

import com.dotnt.server.dto.LevelDto;
import com.dotnt.server.dto.OptionDto;
import com.dotnt.server.dto.QuestionDto;
import com.dotnt.server.dto.QuestionTypeDto;
import com.dotnt.server.dto.response.QuestionResponse;
import com.dotnt.server.entity.Option;
import com.dotnt.server.entity.Question;
import com.dotnt.server.repository.*;
import com.dotnt.server.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final LessonRepository lessonRepository;
    private final QuestionTypeRepository questionTypeRepository;
    private final LevelRepository levelRepository;

    @Override
    public QuestionResponse save(QuestionDto request) {
        return this.toResponse(questionRepository.save(this.toEntity(request)));
    }

    @Override
    public Optional<QuestionResponse> findById(Long id) {
        return Optional.ofNullable(this.toResponse(questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"))));
    }

    @Override
    public List<QuestionResponse> findAll() {
        return questionRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        questionRepository.deleteById(id);
    }

    @Override
    public QuestionResponse update(Long id, QuestionDto questiondto) {
         questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question ID cannot be null for update"));
        return this.toResponse(questionRepository.save(this.toEntity(questiondto)));
    }

    private QuestionResponse toResponse(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .content(question.getContent())
                .options(question.getOptions().stream()
                        .map(option -> OptionDto.builder()
                                .id(option.getId())
                                .content(option.getContent())
                                .isCorrect(option.getIsCorrect())
                                .build())
                        .collect(Collectors.toList()))
                .level(LevelDto.builder()
                        .id(question.getLevel().getId())
                        .name(question.getLevel().getName())
                        .points(question.getLevel().getPoints())
                        .description(question.getLevel().getDescription())
                        .build())
                .questionType(QuestionTypeDto.builder()
                        .id(question.getQuestionType().getId())
                        .name(question.getQuestionType().getName())
                        .description(question.getQuestionType().getDescription())
                        .build())
                .explanation(question.getExplanation())
                .build();
    }
    private Question toEntity(QuestionDto questionDto) {
        return Question.builder()
                .id(questionDto.getId())
                .content(questionDto.getContent())
                .options(questionDto.getOptions().stream()
                        .map(optionDto -> Option.builder()
                                .id(optionDto.getId())
                                .content(optionDto.getContent())
                                .isCorrect(optionDto.getIsCorrect())
                                .build())
                        .collect(Collectors.toSet()))
                .lesson(lessonRepository.findById(questionDto.getLessonId())
                        .orElseThrow(() -> new RuntimeException("Lesson not found")))
                .questionType(questionTypeRepository.findById(questionDto.getQuestionTypeId())
                        .orElseThrow(() -> new RuntimeException("Question Type not found")))
                .level(levelRepository.findById(questionDto.getLevelId())
                        .orElseThrow(() -> new RuntimeException("Level not found")))
                .explanation(questionDto.getExplanation())
                .build();
    }
}
