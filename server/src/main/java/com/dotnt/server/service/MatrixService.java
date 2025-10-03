package com.dotnt.server.service;

import com.dotnt.server.dto.request.MatrixRequest;
import com.dotnt.server.dto.response.MatrixResponse;

import java.util.List;

public interface MatrixService {
    MatrixResponse save(MatrixRequest matrix);
    MatrixResponse findById(Long id);
    List<MatrixResponse> findAll();
    void deleteById(Long id);
    MatrixResponse update(Long id, MatrixRequest matrix);
}
