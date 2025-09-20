package com.dotnt.server.controller;

import com.dotnt.server.dto.SubjectDto;
import com.dotnt.server.dto.response.ApiResponse;
import com.dotnt.server.service.SubjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/subjects")
@Tag(name = "Subject Management", description = "APIs for managing subjects")
@Slf4j
@RequiredArgsConstructor
public class SubjectController extends BaseController {

    private final SubjectService subjectService;

    @GetMapping
    @Operation(summary = "Get all subjects")
    public ResponseEntity<ApiResponse<List<SubjectDto>>> getAllSubjects() {
        log.debug("REST request to get all subjects");

        List<SubjectDto> subjects = subjectService.findAll();
        return success(subjects);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get subject by ID")
    public ResponseEntity<ApiResponse<SubjectDto>> getSubjectById(@PathVariable UUID id) {
        log.debug("REST request to get subject by ID: {}", id);

        return subjectService.findById(id)
                .map(this::success)
                .orElse(error("Subject not found with ID: " + id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new subject")
    public ResponseEntity<ApiResponse<SubjectDto>> createSubject(@Valid @RequestBody SubjectDto subjectDto) {
        log.debug("REST request to create subject: {}", subjectDto.getName());

        try {
            SubjectDto createdSubject = subjectService.save(subjectDto);
            return created(createdSubject);
        } catch (Exception e) {
            log.error("Error creating subject", e);
            return error(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update subject")
    public ResponseEntity<ApiResponse<SubjectDto>> updateSubject(@PathVariable UUID id,
                                                                 @Valid @RequestBody SubjectDto subjectDto) {
        log.debug("REST request to update subject with ID: {}", id);

        try {
            SubjectDto updatedSubject = subjectService.update(id, subjectDto);
            return success("Subject updated successfully", updatedSubject);
        } catch (Exception e) {
            log.error("Error updating subject", e);
            return error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete subject")
    public ResponseEntity<ApiResponse<Void>> deleteSubject(@PathVariable UUID id) {
        log.debug("REST request to delete subject with ID: {}", id);

        try {
            subjectService.deleteById(id);
            return success("Subject deleted successfully", null);
        } catch (Exception e) {
            log.error("Error deleting subject", e);
            return error(e.getMessage());
        }
    }

    @GetMapping("/by-grade/{gradeId}")
    @Operation(summary = "Get subjects by grade ID")
    public ResponseEntity<ApiResponse<List<SubjectDto>>> getSubjectsByGrade(@PathVariable UUID gradeId) {
        log.debug("REST request to get subjects by grade ID: {}", gradeId);

        List<SubjectDto> subjects = subjectService.findByGradeId(gradeId);
        return success(subjects);
    }

    @GetMapping("/search")
    @Operation(summary = "Search subjects by name")
    public ResponseEntity<ApiResponse<List<SubjectDto>>> searchSubjects(@RequestParam String name) {
        log.debug("REST request to search subjects by name: {}", name);

        List<SubjectDto> subjects = subjectService.findByNameContaining(name);
        return success(subjects);
    }
}
