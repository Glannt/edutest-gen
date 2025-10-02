package com.dotnt.server.dto.response;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@Builder
public class RestResponseWrapper<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    private int status;

    public static <T> RestResponseWrapper<T> success(T data) {
        return RestResponseWrapper.<T>builder()
                .success(true)
                .message("Success")
                .data(data)
                .status(HttpStatus.OK.value())
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> RestResponseWrapper<T> error(String message, HttpStatus status) {
        return RestResponseWrapper.<T>builder()
                .success(false)
                .message(message)
                .status(status.value())
                .timestamp(LocalDateTime.now())
                .build();
    }
}
