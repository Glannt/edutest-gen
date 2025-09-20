package com.dotnt.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DifficultyResponse {
    private UUID id;
    private String name;
    private Integer level;
    private String description;
}
