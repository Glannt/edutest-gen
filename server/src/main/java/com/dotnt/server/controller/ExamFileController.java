package com.dotnt.server.controller;

import com.dotnt.server.service.ExamFileService;
import com.itextpdf.text.DocumentException;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
@RestController
@RequestMapping("exams")
@RequiredArgsConstructor
public class ExamFileController {
    private final ExamFileService examExportService;

    @GetMapping("/{examId}/export")
    @Operation(summary = "Xuất 1 đề thi", description = "Export 1 đề thi ra file Word hoặc PDF")
    public ResponseEntity<InputStreamResource> exportExam(
            @PathVariable Long examId,
            @RequestParam(defaultValue = "word") String format) throws IOException, DocumentException {

        return examExportService.exportSingleExam(examId, format);
    }

    @PostMapping("/export-multiple")
    @Operation(summary = "Xuất nhiều đề thi", description = "Export nhiều đề thi ra nhiều file Word hoặc PDF (mỗi đề 1 file)")
    public ResponseEntity<List<String>> exportMultipleExams(
            @RequestBody List<Long> examIds,
            @RequestParam(defaultValue = "word") String format) throws IOException {

        return ResponseEntity.ok(examExportService.exportMultipleExams(examIds, format));
    }

    @PostMapping("/import")
    @Operation(summary = "Import đề thi từ file Word/PDF", description = "Import exam từ file .docx hoặc .pdf")
    public ResponseEntity<String> importExam(@RequestParam("file") MultipartFile file) throws IOException {
        examExportService.importExamFromFile(file);
        return ResponseEntity.ok("Import exam thành công");
    }
}
