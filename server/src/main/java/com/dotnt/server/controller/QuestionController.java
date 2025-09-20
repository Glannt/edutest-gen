package com.dotnt.server.controller;

import com.dotnt.server.dto.QuestionDto;
import com.dotnt.server.dto.response.ApiResponse;
import com.dotnt.server.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/questions")
@Tag(name = "Question Management", description = "APIs for managing questions")
@Slf4j
@RequiredArgsConstructor
public class QuestionController extends BaseController {

    private final QuestionService questionService;



    @GetMapping
    @Operation(summary = "Get all questions with pagination")
    public ResponseEntity<ApiResponse<Page<QuestionDto>>> getAllQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) UUID lessonId) {
        log.debug("REST request to get questions - page: {}, size: {}, lessonId: {}", page, size, lessonId);

        Pageable pageable = PageRequest.of(page, size);

        if (lessonId != null) {
            Page<QuestionDto> questions = questionService.findByLessonIdWithPagination(lessonId, pageable);
            return success(questions);
        } else {
            // For simplicity, we'll return all questions as a list and create a page manually
            List<QuestionDto> allQuestions = questionService.findAll();
            return success("Questions retrieved successfully",
                    new PageImpl<>(allQuestions, pageable, allQuestions.size()));
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get question by ID")
    public ResponseEntity<ApiResponse<QuestionDto>> getQuestionById(@PathVariable UUID id) {
        log.debug("REST request to get question by ID: {}", id);

        return questionService.findById(id)
                .map(this::success)
                .orElse(error("Question not found with ID: " + id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @Operation(summary = "Create new question")
    public ResponseEntity<ApiResponse<QuestionDto>> createQuestion(@Valid @RequestBody QuestionDto questionDto) {
        log.debug("REST request to create question for lesson ID: {}", questionDto.getLessonId());

        try {
            QuestionDto createdQuestion = questionService.save(questionDto);
            return created(createdQuestion);
        } catch (Exception e) {
            log.error("Error creating question", e);
            return error(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @Operation(summary = "Update question")
    public ResponseEntity<ApiResponse<QuestionDto>> updateQuestion(@PathVariable UUID id,
                                                                   @Valid @RequestBody QuestionDto questionDto) {
        log.debug("REST request to update question with ID: {}", id);

        try {
            QuestionDto updatedQuestion = questionService.update(id, questionDto);
            return success("Question updated successfully", updatedQuestion);
        } catch (Exception e) {
            log.error("Error updating question", e);
            return error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete question")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable UUID id) {
        log.debug("REST request to delete question with ID: {}", id);

        try {
            questionService.deleteById(id);
            return success("Question deleted successfully", null);
        } catch (Exception e) {
            log.error("Error deleting question", e);
            return error(e.getMessage());
        }
    }

    @GetMapping("/by-criteria")
    @Operation(summary = "Get questions by criteria")
    public ResponseEntity<ApiResponse<List<QuestionDto>>> getQuestionsByCriteria(
            @RequestParam(required = false) UUID subjectId,
            @RequestParam(required = false) UUID gradeId,
            @RequestParam(required = false) UUID lessonId,
            @RequestParam(required = false) UUID difficultyId,
            @RequestParam(required = false) UUID questionTypeId) {

        log.debug("REST request to get questions by criteria");

        List<QuestionDto> questions = questionService.findByCriteria(
                subjectId, gradeId, lessonId, difficultyId, questionTypeId);

        return success(questions);
    }

    @GetMapping("/search")
    @Operation(summary = "Search questions by content")
    public ResponseEntity<ApiResponse<List<QuestionDto>>> searchQuestions(@RequestParam String keyword) {
        log.debug("REST request to search questions by keyword: {}", keyword);

        List<QuestionDto> questions = questionService.findByContentContaining(keyword);
        return success(questions);
    }
}
