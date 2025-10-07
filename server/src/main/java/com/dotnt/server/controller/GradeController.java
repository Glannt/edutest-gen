package com.dotnt.server.controller;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.GradeDto;
import com.dotnt.server.dto.response.GradeResponse;
import com.dotnt.server.service.GradeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grades")
@RequiredArgsConstructor
@RestResponse
@Tag(name = "Grade API", description = "Quản lý khối lớp (grade) trong hệ thống")
public class GradeController {

    private final GradeService gradeService;

    @Operation(summary = "Tạo mới khối lớp", description = "Thêm một khối lớp (grade) mới vào hệ thống")
    @PostMapping
    public GradeResponse create(@RequestBody GradeDto request) {
        return gradeService.create(request);
    }

    @Operation(summary = "Lấy thông tin khối lớp theo ID", description = "Trả về thông tin chi tiết của khối lớp tương ứng với ID")
    @GetMapping("/{id}")
    public GradeResponse findById(@PathVariable Long id) {
        return gradeService.findById(id);
    }

    @Operation(summary = "Lấy danh sách tất cả các khối lớp", description = "Trả về toàn bộ danh sách khối lớp trong hệ thống")
    @GetMapping
    public List<GradeResponse> findAll() {
        return gradeService.findAll();
    }

    @Operation(summary = "Cập nhật thông tin khối lớp", description = "Cập nhật tên và mô tả khối lớp dựa theo ID")
    @PutMapping("/{id}")
    public GradeResponse update(@PathVariable Long id, @RequestBody GradeDto request) {
        return gradeService.update(id, request);
    }

    @Operation(summary = "Xóa khối lớp theo ID", description = "Xóa một khối lớp khỏi hệ thống dựa theo ID")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        gradeService.deleteById(id);
    }
}

