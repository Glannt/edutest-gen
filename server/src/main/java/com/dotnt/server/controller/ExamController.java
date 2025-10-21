package com.dotnt.server.controller;

import com.dotnt.server.annotation.PagingResponse;
import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.request.AutoGenerateExamListRequest;
import com.dotnt.server.dto.request.AutoGenerateExamRequest;
import com.dotnt.server.dto.request.CreateExamRequest;
import com.dotnt.server.dto.response.ExamResponse;
import com.dotnt.server.service.ExamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exams")
@RequiredArgsConstructor
@RestResponse
@Tag(name = "Exam API", description = "Quản lý Exam và câu hỏi liên quan")
public class ExamController {

    private final ExamService examService;

    @PostMapping
    @Operation(summary = "Tạo exam mới", description = "Tạo exam với danh sách câu hỏi, shuffle nếu cần")
    public ExamResponse createExam(@RequestBody CreateExamRequest request) {
        // Response sẽ tự động wrap vào RestResponseWrapper.success()
        // và status 201 nhờ RestResponseAdvice
        return examService.createExam(request);
    }
    @PostMapping("/auto-generate")
    @Operation(summary = "Tự động tạo đề thi", description = "Sinh đề thi từ matrix, shuffle câu hỏi và options")
    public ExamResponse autoGenerateExam(@RequestBody AutoGenerateExamRequest request) {
        return examService.autoGenerateExam(request);
    }

    @PostMapping("/auto-generates")
    @Operation(summary = "Tự động tạo nhiều đề thi", description = "Sinh nhiều mã đề tự động, dựa trên matrix và logic autoGenerateExam()")
    public List<ExamResponse> autoGenerateExamList(@RequestBody AutoGenerateExamListRequest request) {
        return examService.autoGenerateExamList(request);
    }


    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin exam theo ID")
    public ExamResponse getExam(@PathVariable Long id) {
        // Response sẽ wrap và status 200
        return examService.getExam(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật exam theo ID")
    public ExamResponse updateExam(@PathVariable Long id,
                                   @RequestBody CreateExamRequest request) {
        // Response sẽ wrap và status 200
        return examService.updateExam(id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa exam theo ID")
    public void deleteExam(@PathVariable Long id) {
        // Response sẽ wrap và status 204
        examService.deleteExam(id);
    }

//    GET /api/exams?page=0&size=10&sort=name,asc
    @GetMapping
    @PagingResponse
    public Page<ExamResponse> getPagedExams(Pageable pageable) {
        return examService.getPaged(pageable);
    }
    @GetMapping("/{matrixId}/exams")
    @PagingResponse
    public Page<ExamResponse> getExamsByMatrix(
            @PathVariable Long matrixId,
            Pageable pageable
    ) {
        return examService.findByMatrixId(matrixId, pageable);
    }
}
