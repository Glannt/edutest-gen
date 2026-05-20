package com.dotnt.server.controller;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.GradeDto;
import com.dotnt.server.dto.response.GradeResponse;
import com.dotnt.server.service.GradeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('ADMIN')")
    public GradeResponse create(@RequestBody GradeDto request) {
        return gradeService.create(request);
    }

    @Operation(summary = "Lấy thông tin khối lớp theo ID", description = "Trả về thông tin chi tiết của khối lớp tương ứng với ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public GradeResponse findById(@PathVariable Long id) {
        return gradeService.findById(id);
    }

    @Operation(summary = "Lấy danh sách tất cả các khối lớp", description = "Trả về toàn bộ danh sách khối lớp trong hệ thống")
    @GetMapping("paged")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<GradeResponse> findAllPaged(
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
        return gradeService.findAllPaged(pageable);
    }

    @GetMapping()
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public List<GradeResponse> findAll() {
        return gradeService.findAll();
    }

    @Operation(summary = "Cập nhật thông tin khối lớp", description = "Cập nhật tên và mô tả khối lớp dựa theo ID")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public GradeResponse update(@PathVariable Long id, @RequestBody GradeDto request) {
        return gradeService.update(id, request);
    }

    @Operation(summary = "Xóa khối lớp theo ID", description = "Xóa một khối lớp khỏi hệ thống dựa theo ID")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        gradeService.deleteById(id);
    }
}

