package com.dotnt.server.dto.response;

import com.dotnt.server.dto.BaseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class LessonResponse extends BaseDto {
    private String name;
    private String description;
    private Integer orderIndex;
}