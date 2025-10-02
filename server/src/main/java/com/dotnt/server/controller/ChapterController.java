package com.dotnt.server.controller;


import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.request.ChapterRequest;
import com.dotnt.server.dto.response.ChapterResponse;
import com.dotnt.server.service.ChapterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/chapters")
@RequiredArgsConstructor
@RestResponse
@Tag(name = "Chapter API", description = "Quản lý chương (chapter) trong hệ thống")
public class ChapterController {

    private final ChapterService chapterService;

    @Operation(summary = "Tạo mới một chương", description = "Thêm một chương mới vào hệ thống")
    @PostMapping
    public ChapterResponse create(@RequestBody ChapterRequest request) {
        return chapterService.save(request);
    }

    @Operation(summary = "Lấy thông tin chương theo ID", description = "Trả về chương tương ứng với ID")
    @GetMapping("/{id}")
    public Optional<ChapterResponse> findById(@PathVariable Long id) {
        return chapterService.findById(id);
    }

    @Operation(summary = "Lấy danh sách tất cả các chương", description = "Trả về toàn bộ danh sách chương")
    @GetMapping
    public List<ChapterResponse> findAll() {
        return chapterService.findAll();
    }

    @Operation(summary = "Cập nhật chương", description = "Cập nhật thông tin chương dựa theo ID")
    @PutMapping
    public ChapterResponse update(@RequestBody ChapterRequest request) {
        return chapterService.update(request);
    }

    @Operation(summary = "Xóa chương theo ID", description = "Xóa một chương trong hệ thống dựa theo ID")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        chapterService.deleteById(id);
    }
}
