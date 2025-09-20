package com.dotnt.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class GradeDto extends BaseDto {

    @NotBlank(message = "Grade name is required")
    private String name;

    private Integer level;

    private List<UUID> subjectIds;
}
