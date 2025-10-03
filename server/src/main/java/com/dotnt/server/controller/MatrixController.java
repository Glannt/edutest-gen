package com.dotnt.server.controller;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.request.MatrixRequest;
import com.dotnt.server.dto.response.MatrixResponse;
import com.dotnt.server.service.MatrixService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestResponse
@RestController
@RequestMapping("/matrices")
@RequiredArgsConstructor
public class MatrixController {

    private final MatrixService matrixService;

    @PostMapping
    public MatrixResponse create(@RequestBody MatrixRequest request) {
        return matrixService.save(request);
    }

    @GetMapping("/{id}")
    public MatrixResponse findById(@PathVariable Long id) {
        return matrixService.findById(id);
    }

    @GetMapping
    public List<MatrixResponse> findAll() {
        return matrixService.findAll();
    }

    @PutMapping("/{id}")
    public MatrixResponse update(@PathVariable Long id,
                                 @RequestBody MatrixRequest request) {
        return matrixService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        matrixService.deleteById(id);
    }
}
