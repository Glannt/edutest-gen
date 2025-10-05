package com.dotnt.server.service;

import com.dotnt.server.dto.request.MatrixDetailRequest;
import com.dotnt.server.dto.response.MatrixDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MatrixDetailService {
    MatrixDetailResponse save(MatrixDetailRequest detail);
    MatrixDetailResponse findById(Long id);
    List<MatrixDetailResponse> findAll();
    void deleteById(Long id);
    MatrixDetailResponse update(Long id, MatrixDetailRequest detail);
    Page<MatrixDetailResponse> getPaged(Pageable pageable);
}
