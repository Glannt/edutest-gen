package com.dotnt.server.controller;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.SubjectDto;
import com.dotnt.server.dto.response.ChapterResponse;
import com.dotnt.server.service.GradeSubjectService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grades")
@RestResponse
@RequiredArgsConstructor
public class GradeSubjectController {

    private final GradeSubjectService gradeSubjectService;

    @GetMapping("/{gradeId}/subjects")
    public List<SubjectDto> getSubjectsByGrade(@PathVariable Long gradeId) {
        return gradeSubjectService.getSubjectsByGrade(gradeId);
    }

    @GetMapping("/{gradeId}/subjects/{subjectId}/chapters")
    public List<ChapterResponse> getChaptersByGradeAndSubject(@PathVariable Long gradeId,
                                                              @PathVariable Long subjectId) {
        return gradeSubjectService.getChaptersByGradeAndSubject(gradeId, subjectId);
    }
}

