package com.dotnt.server.controller;

import com.dotnt.server.dto.ExamDto;
import com.dotnt.server.dto.request.ExamGenerationRequest;
import com.dotnt.server.dto.response.ApiResponse;
import com.dotnt.server.service.LicenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/exams")
@Tag(name = "Exam Management", description = "APIs for generating and exporting exams")
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
@Slf4j
@RequiredArgsConstructor
public class ExamController extends BaseController {

    private final ExamService examService;
    private final LicenseService licenseService;


    @PostMapping("/generate")
    @Operation(summary = "Generate exam based on criteria")
    public ResponseEntity<ApiResponse<ExamDto>> generateExam(@Valid @RequestBody ExamGenerationRequest request,
                                                             Authentication authentication) {
        log.info("REST request to generate exam");

        try {
            // Get user ID from authentication
            UUID userId = getCurrentUserId(authentication);

            // Validate license
            if (!licenseService.validateLicense(userId)) {
                return error("Invalid or expired license. Please activate a valid license key.");
            }

            // Generate exam
            ExamDto exam = examService.generateExam(request);

            // Increment license usage
            licenseService.incrementUsage(userId);

            return success("Exam generated successfully", exam);

        } catch (Exception e) {
            log.error("Error generating exam", e);
            return error(e.getMessage());
        }
    }

    @PostMapping("/export/pdf")
    @Operation(summary = "Export exam to PDF")
    public ResponseEntity<byte[]> exportExamToPdf(@Valid @RequestBody ExamGenerationRequest request,
                                                  Authentication authentication) {
        log.info("REST request to export exam to PDF");

        try {
            // Validate license
            UUID userId = getCurrentUserId(authentication);
            if (!licenseService.validateLicense(userId)) {
                return ResponseEntity.badRequest().build();
            }

            // Generate exam
            ExamDto exam = examService.generateExam(request);

            // Export to PDF
            byte[] pdfContent = examService.exportExamToPdf(exam);

            // Increment license usage
            licenseService.incrementUsage(userId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "exam.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfContent);

        } catch (Exception e) {
            log.error("Error exporting exam to PDF", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/export/word")
    @Operation(summary = "Export exam to Word")
    public ResponseEntity<byte[]> exportExamToWord(@Valid @RequestBody ExamGenerationRequest request,
                                                   Authentication authentication) {
        log.info("REST request to export exam to Word");

        try {
            // Validate license
            UUID userId = getCurrentUserId(authentication);
            if (!licenseService.validateLicense(userId)) {
                return ResponseEntity.badRequest().build();
            }

            // Generate exam
            ExamDto exam = examService.generateExam(request);

            // Export to Word
            byte[] wordContent = examService.exportExamToWord(exam);

            // Increment license usage
            licenseService.incrementUsage(userId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "exam.docx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(wordContent);

        } catch (Exception e) {
            log.error("Error exporting exam to Word", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    private UUID getCurrentUserId(Authentication authentication) {
        // This should be implemented based on your JWT token structure
        // For now, we'll assume the user details contain the user ID
        return UUID.randomUUID(); // Placeholder - implement based on your auth system
    }
}
