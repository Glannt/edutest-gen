package com.dotnt.server.service.impl;

import com.dotnt.server.dto.LessonDto;
import com.dotnt.server.dto.response.LessonResponse;
import com.dotnt.server.entity.Lesson;
import com.dotnt.server.repository.ChapterRepository;
import com.dotnt.server.repository.GradeRepository;
import com.dotnt.server.repository.LessonRepository;
import com.dotnt.server.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {
    private final LessonRepository lessonRepository;
    private final GradeRepository gradeRepository;
    private final ChapterRepository chapterRepository;

    @Override
    @Transactional
    public LessonResponse create(LessonDto lessonDto) {
        Lesson lesson = Lesson.builder()
                .name(lessonDto.getName())
                .description(lessonDto.getDescription())
                .orderIndex(lessonDto.getOrderIndex())
                // nếu Lesson có quan hệ với Chapter thì cần set thêm:
                .chapter(chapterRepository.findById(lessonDto.getChapterId()).orElseThrow(() -> new RuntimeException("Chapter not found")))
                .build();

        Lesson savedLesson = lessonRepository.save(lesson);



        return convertToResponse(savedLesson);
    }

    @Override
    @Transactional
    public LessonResponse update(Long id, LessonDto lessonDto) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        lesson.setName(lessonDto.getName());
        lesson.setDescription(lessonDto.getDescription());
        lesson.setOrderIndex(lessonDto.getOrderIndex());

        Lesson updatedLesson = lessonRepository.save(lesson);

        return convertToResponse(updatedLesson);
    }

    @Override
    public LessonResponse findById(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        return convertToResponse(lesson);
    }

    @Override
    public List<LessonResponse> findAll() {
        return lessonRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!lessonRepository.existsById(id)) {
            throw new RuntimeException("Lesson not found");
        }
        lessonRepository.deleteById(id);
    }

    @Override
    public List<LessonResponse> findByChapterId(Long chapterId) {

        return lessonRepository.findByChapterId(chapterId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private LessonResponse convertToResponse(Lesson lesson) {

        return LessonResponse.builder()
                .id(lesson.getId())
                .name(lesson.getName())
                .description(lesson.getDescription())
                .orderIndex(lesson.getOrderIndex())
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}