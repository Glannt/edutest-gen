package com.dotnt.server.service.impl;

import com.dotnt.server.dto.*;
import com.dotnt.server.dto.response.QuestionResponse;
import com.dotnt.server.entity.Option;
import com.dotnt.server.entity.Question;
import com.dotnt.server.repository.*;
import com.dotnt.server.service.QuestionService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final LessonRepository lessonRepository;
    private final QuestionTypeRepository questionTypeRepository;
    private final LevelRepository levelRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String N8N_URL = "http://localhost:5678/webhook/search-questions-vietjack";
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

    @Override
    public List<QuestionResponse> findByLessonId(Long lessonId) {
        return questionRepository.findByLessonId(lessonId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuestionResponse> searchN8n() {
//        // 1️⃣ Gọi n8n để lấy dữ liệu JSON
//        ResponseEntity<Map> response = restTemplate.getForEntity(N8N_URL, Map.class);
//        Map<String, Object> body = response.getBody();
//        if (body == null || !body.containsKey("questions")) {
//            return List.of();
//        }
//
//        // 2️⃣ Lấy danh sách câu hỏi
//        List<Map<String, Object>> questions = (List<Map<String, Object>>) body.get("questions");
//        log.info("questions {}", questions);
//        // 3️⃣ Map từng câu hỏi sang QuestionResponse
//        return questions.stream().map(q -> {
//            String title = (String) q.get("title");
//            String reason = (String) q.get("reason");
//            List<String> rawOptions = (List<String>) q.get("options");
//
//            List<OptionDto> optionDtos = rawOptions.stream()
//                    .map(opt -> {
//                        String[] parts = opt.split("\\.", 2); // Tách "A. nội dung"
//                        String label = parts[0].trim();
//                        String content = parts.length > 1 ? parts[1].trim() : "";
//                        return OptionDto.builder()
////                                .content(label)
//                                .content(content)
//                                .build();
//                    })
//                    .collect(Collectors.toList());
//
//            return QuestionResponse.builder()
//                    .id(null)
//                    .contentJson(title)
//                    .explanation(reason)
//                    .options(optionDtos)
//                    .isActive(true)
//                    .createdAt(LocalDateTime.now())
//                    .updatedAt(LocalDateTime.now())
//                    .build();
//        }).collect(Collectors.toList());
        return List.of();
    }

    private QuestionResponse toResponse(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .contentJson(question.getContentJson())
                .explanationJson(question.getExplanationJson())
                .options(question.getOptions().stream()
                        .map(opt -> OptionDto.builder()
                                .id(opt.getId())
                                .content(opt.getContent())
                                .isCorrect(opt.getIsCorrect())
                                .orderIndex(opt.getOrderIndex())
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
                .isActive(true)
                .createdAt(question.getCreatedAt())
                .updatedAt(question.getUpdatedAt())
                .build();
    }
    private Question toEntity(QuestionDto questionDto) {
        Question question = Question.builder()
                .id(questionDto.getId())
                .contentJson(questionDto.getContentJson())
                .explanationJson(questionDto.getExplanationJson())
                .lesson(lessonRepository.findById(questionDto.getLessonId())
                        .orElseThrow(() -> new RuntimeException("Lesson not found")))
                .questionType(questionTypeRepository.findById(questionDto.getQuestionTypeId())
                        .orElseThrow(() -> new RuntimeException("Question Type not found")))
                .level(levelRepository.findById(questionDto.getLevelId())
                        .orElseThrow(() -> new RuntimeException("Level not found")))
                .build();

        if (questionDto.getOptions() != null && !questionDto.getOptions().isEmpty()) {
            Set<Option> options = questionDto.getOptions().stream()
                    .map(optDto -> Option.builder()
                            .content(optDto.getContent())
                            .isCorrect(optDto.getIsCorrect())
                            .orderIndex(optDto.getOrderIndex())
                            .question(question)
                            .build())
                    .collect(Collectors.toSet());
            question.setOptions(options);
        }

        return question;
    }
}
