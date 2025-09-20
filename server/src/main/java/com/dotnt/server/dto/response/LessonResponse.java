package com.dotnt.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonResponse {
    private UUID id;
    private String name;
    private String description;
    private UUID subjectId;
    private String subjectName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}