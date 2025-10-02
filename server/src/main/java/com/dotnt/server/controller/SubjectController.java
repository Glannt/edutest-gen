package com.dotnt.server.controller;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.SubjectDto;
import com.dotnt.server.service.SubjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/subjects")
@RequiredArgsConstructor
@RestResponse
@Tag(name = "Subject API", description = "Quản lý môn học (subject) trong hệ thống")
public class SubjectController {

    private final SubjectService subjectService;

    @Operation(summary = "Tạo mới môn học", description = "Thêm một môn học mới vào hệ thống")
    @PostMapping
    public SubjectDto create(@RequestBody SubjectDto subjectDto) {
        return subjectService.create(subjectDto);
    }

    @Operation(summary = "Cập nhật môn học", description = "Cập nhật thông tin môn học dựa theo ID")
    @PutMapping("/{id}")
    public SubjectDto update(@PathVariable Long id, @RequestBody SubjectDto subjectDto) {
        return subjectService.update(id, subjectDto);
    }

    @Operation(summary = "Tìm môn học theo ID", description = "Trả về thông tin môn học tương ứng với ID")
    @GetMapping("/{id}")
    public Optional<SubjectDto> findById(@PathVariable Long id) {
        return subjectService.findById(id);
    }

    @Operation(summary = "Lấy danh sách môn học", description = "Trả về toàn bộ danh sách môn học")
    @GetMapping
    public List<SubjectDto> findAll() {
        return subjectService.findAll();
    }

    @Operation(summary = "Xóa môn học", description = "Xóa môn học dựa theo ID")
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        subjectService.deleteById(id);
    }

    @Operation(summary = "Tìm kiếm môn học theo tên", description = "Tìm môn học có tên chứa từ khóa")
    @GetMapping("/search")
    public List<SubjectDto> searchByName(@RequestParam("name") String name) {
        return subjectService.findByNameContaining(name);
    }
}
