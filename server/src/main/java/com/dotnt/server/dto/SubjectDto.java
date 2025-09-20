package com.dotnt.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Builder
public class SubjectDto extends BaseDto {

    @NotBlank(message = "Subject name is required")
    private String name;

    private String description;

    private List<Long> gradeIds;
}
