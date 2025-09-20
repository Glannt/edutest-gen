package com.dotnt.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class DifficultyDto extends BaseDto {

    @NotBlank(message = "Difficulty name is required")
    private String name;

    private Integer level;

    private String description;
}
