package com.dotnt.server.controller;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.LessonDto;
import com.dotnt.server.dto.response.LessonResponse;
import com.dotnt.server.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lessons")
@RestResponse
@RequiredArgsConstructor
public class LessonController {
    private final LessonService lessonService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public LessonResponse createLesson(@Valid @RequestBody LessonDto lessonDto) {
        return lessonService.create(lessonDto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public LessonResponse updateLesson(@PathVariable Long id,
                                                       @Valid @RequestBody LessonDto lessonDto) {
        return lessonService.update(id, lessonDto);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public LessonResponse getLesson(@PathVariable Long id) {
        return lessonService.findById(id);
    }

    @GetMapping("/chapters/{chapterId}/lessons")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public List<LessonResponse> getLessonByChapterId(@PathVariable Long chapterId) {
        return lessonService.findByChapterId(chapterId);
    }

    @GetMapping
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public List<LessonResponse> getAllLessons() {
        return lessonService.findAll();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteLesson(@PathVariable Long id) {
        lessonService.deleteById(id);

    }
}
