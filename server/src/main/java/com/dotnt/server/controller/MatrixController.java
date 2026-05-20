package com.dotnt.server.controller;

import com.dotnt.server.annotation.PagingResponse;
import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.request.MatrixRequest;
import com.dotnt.server.dto.response.MatrixResponse;
import com.dotnt.server.service.MatrixService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestResponse
@RestController
@RequestMapping("/matrices")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class MatrixController {

    private final MatrixService matrixService;

    @PostMapping
    @Operation(summary = "Tạo ma trận mới", description = "Tạo ma trận kiến thức dựa trên thông tin đầu vào")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tạo ma trận thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ")
    })
    public MatrixResponse create(@RequestBody MatrixRequest request) {
        return matrixService.save(request);
    }

    @Operation(summary = "Lấy danh sách ma trận theo lớp và môn học", description = "Có thể lọc theo gradeId và subjectId")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Trả về danh sách ma trận"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy ma trận")
    })
    @GetMapping("filter")
    public List<MatrixResponse> getMatrices(
            @RequestParam Long gradeId,
            @RequestParam(required = false) Long subjectId
    ) {
        return matrixService.findByGradeAndSubject(gradeId, subjectId);
    }

    @Operation(summary = "Lấy ma trận theo ID", description = "Trả về thông tin chi tiết của ma trận")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Trả về ma trận thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy ma trận")
    })
    @GetMapping("/{id}")
    public MatrixResponse findById(@PathVariable Long id) {
        return matrixService.findById(id);
    }

    @Operation(summary = "Lấy danh sách tất cả ma trận", description = "Hỗ trợ phân trang thông qua Pageable")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Trả về danh sách ma trận")
    })
    @GetMapping
    @PagingResponse
    public Page<MatrixResponse> findAll(Pageable pageable) {
        return matrixService.findAll(pageable);
    }

    @Operation(summary = "Lấy danh sách tất cả ma trận", description = "Không phân trang")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Trả về danh sách ma trận")
    })
    @GetMapping("/all")
    public List<MatrixResponse> findAll() {
        return matrixService.findAll();
    }

    @Operation(summary = "Cập nhật ma trận", description = "Cập nhật thông tin ma trận dựa trên ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy ma trận"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ")
    })
    @PutMapping("/{id}")
    public MatrixResponse update(@PathVariable Long id,
                                 @RequestBody MatrixRequest request) {
        return matrixService.update(id, request);
    }

    @Operation(summary = "Xóa ma trận", description = "Xóa ma trận dựa trên ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Xóa thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy ma trận")
    })
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        matrixService.deleteById(id);
    }
}
