package com.dotnt.server.dto.request;

import com.dotnt.server.dto.BaseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ChapterRequest extends BaseDto {
    private String name;
    private String description;
    private Long subjectId;
    private List<Long> lessonId;
}
