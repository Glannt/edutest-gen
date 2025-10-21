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
public class OptionDto extends BaseDto{
    private List<ContentBlockDto> content;
    private Boolean isCorrect;
    private Integer orderIndex;
}
