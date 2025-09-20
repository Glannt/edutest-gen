package com.dotnt.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public abstract class BaseDto {
    private UUID id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}