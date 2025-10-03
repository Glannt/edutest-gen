package com.dotnt.server.controller;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.request.ExamMatrixDetailRequest;
import com.dotnt.server.dto.response.ExamMatrixDetailResponse;
import com.dotnt.server.service.ExamMatrixDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestResponse
@RestController
@RequestMapping("/exam-matrix-details")
@RequiredArgsConstructor
public class ExamMatrixDetailController {

    private final ExamMatrixDetailService examMatrixDetailService;

    @PostMapping
    public ExamMatrixDetailResponse create(@RequestBody ExamMatrixDetailRequest request) {
        return examMatrixDetailService.save(request);
    }

    @GetMapping("/{id}")
    public ExamMatrixDetailResponse findById(@PathVariable Long id) {
        return examMatrixDetailService.findById(id);
    }

    @GetMapping
    public List<ExamMatrixDetailResponse> findAll() {
        return examMatrixDetailService.findAll();
    }

    @PutMapping("/{id}")
    public ExamMatrixDetailResponse update(@PathVariable Long id,
                                           @RequestBody ExamMatrixDetailRequest request) {
        return examMatrixDetailService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        examMatrixDetailService.deleteById(id);
    }
}
