package com.dotnt.server.service.impl;

import com.dotnt.server.dto.*;
import com.dotnt.server.dto.request.VietjackRequest;
import com.dotnt.server.dto.response.QuestionResponse;
import com.dotnt.server.entity.Option;
import com.dotnt.server.entity.Question;
import com.dotnt.server.repository.*;
import com.dotnt.server.service.QuestionService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
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
    private static final Pattern FORMULA_PATTERN = Pattern.compile(
            ".*([0-9a-zA-Z√∑∫π±×÷≠≥≤^/()*=]+).*"
    );
    @Override
    public QuestionResponse save(QuestionDto request) {
        if (request.getOptions() != null) {
            System.out.println("📌 QuestionDto Options:");
            request.getOptions().forEach(opt ->
                    System.out.println("OrderIndex: " + opt.getOrderIndex()
                            + ", isCorrect: " + opt.getIsCorrect()
                            + ", content: " + opt.getContent())
            );
        }
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
    public List<QuestionResponse> searchN8n(VietjackRequest request) {
        // 1️⃣ Chuẩn bị request tới n8n
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(N8N_URL)
                .queryParam("grade", request.getGrade())
                .queryParam("subject", request.getSubject())
                .queryParam("chapter", request.getChapter())
                .queryParam("lesson", request.getLesson())
                .queryParam("type", request.getType());

// 2️⃣ Gửi GET request tới n8n
        ResponseEntity<Map> response = restTemplate.getForEntity(builder.toUriString(), Map.class);
        Map<String, Object> result = response.getBody();

        if (result == null || !result.containsKey("questions")) {
            return List.of();
        }

        // 2️⃣ Lấy danh sách câu hỏi
        List<Map<String, Object>> questions = (List<Map<String, Object>>) result.get("questions");

        return questions.stream().map(q -> {
            // 🟩 Lấy dữ liệu cơ bản
            String title = (String) q.get("title");
            String answerTrue = (String) q.get("answerTrue");
            List<String> rawOptions = (List<String>) q.get("options");

            // 🟩 Làm sạch danh sách đáp án (loại bỏ A., B., ...)
            List<String> cleanedOptions = rawOptions.stream()
                    .map(opt -> opt.replaceFirst("^[A-D]\\.?\\s*", "").trim())
                    .collect(Collectors.toList());

            // 🟩 Xác định đáp án đúng dựa vào nội dung
            String normalizedAnswer = answerTrue != null
                    ? answerTrue.replaceFirst("^[A-D]\\.?\\s*", "").trim()
                    : "";

            // 🟩 Map sang OptionDto (và đánh dấu đáp án đúng)
            List<OptionDto> optionDtos = cleanedOptions.stream()
                    .map(opt -> OptionDto.builder()
                            .content(parseTextToContentBlocks(opt))
                            .isCorrect(opt.equalsIgnoreCase(normalizedAnswer))
                            .build())
                    .collect(Collectors.toList());

            // 🟩 Map title sang ContentBlockDto (vì QuestionResponse dùng List<ContentBlockDto>)
            List<ContentBlockDto> contentBlocks = List.of(
                    ContentBlockDto.builder()
                            .type("text")
                            .value(title)
                            .build()
            );

            // 🟩 Build QuestionResponse
            return QuestionResponse.builder()
                    .id(null)
                    .contentJson(contentBlocks)
                    .explanationJson(List.of()) // chưa có reason, để rỗng
                    .options(optionDtos)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
        }).collect(Collectors.toList());
    }


    private QuestionResponse toResponse(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .contentJson(question.getContentJson())
                .explanationJson(question.getExplanationJson())
                .options(question.getOptions().stream()
                        .map(opt -> OptionDto.builder()
                                .id(opt.getId())
                                .content(opt.getContentJson())
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
            List<Option> options = questionDto.getOptions().stream()
                    .filter(optDto -> optDto.getContent() != null && !optDto.getContent().isEmpty())
                    .map(optDto -> Option.builder()
                            .contentJson(optDto.getContent())
                            .isCorrect(optDto.getIsCorrect())
                            .orderIndex(optDto.getOrderIndex())
                            .question(question)
                            .build())
                    .collect(Collectors.toList());
            question.setOptions(options);
        }

        return question;
    }

    private List<ContentBlockDto> parseTextToContentBlocks(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }

        String[] parts = text.trim().split("\\s+");

        return Arrays.stream(parts)
                .map(word -> {
                    String type = detectContentType(word);
                    return ContentBlockDto.builder()
                            .type(type)
                            .value(word)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private String detectContentType(String word) {
        // Nếu chứa ký tự toán học hoặc biểu thức, coi là formula
        if (FORMULA_PATTERN.matcher(word).matches() &&
                word.matches(".*[0-9√∑∫π±×÷≠≥≤^/()*=].*")) {
            return "formula";
        }
        return "text";
    }
}
