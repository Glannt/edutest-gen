package com.dotnt.server.controller;

import com.dotnt.server.service.MatrixService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
@RestController
@RequestMapping("/matrices/export")
@RequiredArgsConstructor
public class MatrixExportController {
    private final MatrixService matrixService;

    @Operation(summary = "Export 1 ma trận", description = "Xuất ma trận ra file Excel (.xlsx)")
    @GetMapping("{id}")
    public ResponseEntity<InputStreamResource> exportSingleMatrix(@PathVariable Long id) throws IOException {
        ByteArrayInputStream in = matrixService.exportMatrixToExcel(id);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=matrix_" + id + ".xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @Operation(summary = "Export nhiều ma trận", description = "Xuất nhiều ma trận ra nhiều file Excel (nhiều file trong zip)")
    @PostMapping("multiple")
    public ResponseEntity<InputStreamResource> exportMultipleMatrix(@RequestBody List<Long> matrixIds) throws IOException {
        ByteArrayInputStream in = matrixService.exportMultipleMatrixToZip(matrixIds);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=matrices_export.zip");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(in));
    }
}
