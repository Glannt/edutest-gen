package com.dotnt.server.advice;

import com.dotnt.server.dto.response.RestResponseWrapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Bắt tất cả exception chưa được xử lý
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public RestResponseWrapper<Object> handleException(Exception ex) {
        // Tránh lộ thông tin nhạy cảm, chỉ log chi tiết server-side
        ex.printStackTrace();
        return RestResponseWrapper.error("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public RestResponseWrapper<Object> handleValidation(MethodArgumentNotValidException ex) {
        // Lấy chi tiết field lỗi
        var errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .toList();

        // Gộp thành 1 string
        String errorMessage = String.join("; ", errors);

        return RestResponseWrapper.error("Validation failed: " + errorMessage, HttpStatus.BAD_REQUEST);
    }

    // Not found
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public RestResponseWrapper<Object> handleNotFound(EntityNotFoundException ex) {
        return RestResponseWrapper.error(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}