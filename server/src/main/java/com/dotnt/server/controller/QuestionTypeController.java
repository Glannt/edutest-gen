package com.dotnt.server.controller;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.QuestionTypeDto;
import com.dotnt.server.dto.response.GradeResponse;
import com.dotnt.server.service.QuestionTypeService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/question-types")
@RestResponse
@RequiredArgsConstructor
public class QuestionTypeController {
    private final QuestionTypeService questionTypeService;

    @GetMapping
    @Operation(summary = "Get all question types")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public List<QuestionTypeDto> getAllQuestionTypes() {
        return questionTypeService.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get question type by ID")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public QuestionTypeDto getQuestionTypeById(@PathVariable Long id) {
        return questionTypeService.findById(id)
                .orElseThrow(() -> new RuntimeException("QuestionType not found with id " + id));
    }

    @GetMapping("paged")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public Page<QuestionTypeDto> findAllPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending()
        );
        return questionTypeService.findAllPaged(pageable);
    }

    @PostMapping
    @Operation(summary = "Create new question type")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public QuestionTypeDto createQuestionType(@RequestBody QuestionTypeDto dto) {
        QuestionTypeDto saved = questionTypeService.save(dto);

        // Optionally set Location header
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getId())
                .toUri();
        // Nếu muốn sử dụng header, có thể return ResponseEntity:
        // return ResponseEntity.created(location).body(saved);

        return saved;
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update question type")
    @PreAuthorize("hasRole('ADMIN')")
    public QuestionTypeDto updateQuestionType(@PathVariable Long id, @RequestBody QuestionTypeDto dto) {
        return questionTypeService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete question type")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteQuestionType(@PathVariable Long id) {
        questionTypeService.deleteById(id);
    }
}
