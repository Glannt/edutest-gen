package com.dotnt.server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class GradeDto extends BaseDto {
    private String name;

    private Integer level;

    private String description;

    private List<Long> lessonIds;
}
