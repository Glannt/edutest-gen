package com.dotnt.server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class LevelDto extends BaseDto {

//    @NotBlank(message = "Difficulty name is required")
    private String name;

    private String description;

    private Double points;
}
