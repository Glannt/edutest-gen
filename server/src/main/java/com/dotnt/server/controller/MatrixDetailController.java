package com.dotnt.server.controller;

import com.dotnt.server.annotation.PagingResponse;
import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.request.MatrixDetailRequest;
import com.dotnt.server.dto.response.MatrixDetailResponse;
import com.dotnt.server.service.MatrixDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestResponse
@RestController
@RequestMapping("/matrix-details")
@RequiredArgsConstructor
public class MatrixDetailController {

    private final MatrixDetailService matrixDetailService;

    @PostMapping
    public MatrixDetailResponse create(@RequestBody MatrixDetailRequest request) {
        return matrixDetailService.save(request);
    }

    @GetMapping("/{id}")
    public MatrixDetailResponse findById(@PathVariable Long id) {
        return matrixDetailService.findById(id);
    }

    @GetMapping
    public List<MatrixDetailResponse> findAll() {
        return matrixDetailService.findAll();
    }

    @PutMapping("/{id}")
    public MatrixDetailResponse update(@PathVariable Long id,
                                       @RequestBody MatrixDetailRequest request) {
        return matrixDetailService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        matrixDetailService.deleteById(id);
    }

    @GetMapping("/paged")
    @PagingResponse
    public Page<MatrixDetailResponse> getPaged(Pageable pageable) {
        return matrixDetailService.getPaged(pageable);
    }
}
