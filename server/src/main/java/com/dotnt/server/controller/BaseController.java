package com.dotnt.server.controller;


import com.dotnt.server.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public abstract class BaseController {

    protected <T> ResponseEntity<ApiResponse<T>> success(T data) {
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    protected <T> ResponseEntity<ApiResponse<T>> success(String message, T data) {
        return ResponseEntity.ok(ApiResponse.success(message, data));
    }

    protected <T> ResponseEntity<ApiResponse<T>> created(T data) {
        ApiResponse<T> response = ApiResponse.success("Created successfully", data);
        response.setStatus(HttpStatus.CREATED.value());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    protected <T> ResponseEntity<ApiResponse<T>> error(String message) {
        return ResponseEntity.badRequest().body(ApiResponse.error(message));
    }

    protected <T> ResponseEntity<ApiResponse<T>> error(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(ApiResponse.error(message, status));
    }
}