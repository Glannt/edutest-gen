package com.dotnt.server.service.impl;

import com.dotnt.server.dto.GradeDto;
import com.dotnt.server.dto.response.GradeResponse;
import com.dotnt.server.entity.Grade;
import com.dotnt.server.entity.LessonGrade;
import com.dotnt.server.repository.GradeRepository;
import com.dotnt.server.repository.LessonGradeRepository;
import com.dotnt.server.repository.LessonRepository;
import com.dotnt.server.service.GradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GradeServiceImpl implements GradeService {
    private final GradeRepository gradeRepository;
    private final LessonRepository lessonRepository;
    private final LessonGradeRepository lessonGradeRepository;

    public GradeServiceImpl(GradeRepository gradeRepository, LessonRepository lessonRepository, LessonGradeRepository lessonGradeRepository) {
        this.gradeRepository = gradeRepository;
        this.lessonRepository = lessonRepository;
        this.lessonGradeRepository = lessonGradeRepository;
    }

    @Override
    @Transactional
    public GradeResponse create(GradeDto gradeDto) {
        // Check if grade with same name already exists
        if (gradeRepository.existsByName(gradeDto.getName())) {
            throw new RuntimeException("Grade with this name already exists");
        }

        Grade grade = Grade.builder()
                .name(gradeDto.getName())
                .description(gradeDto.getDescription())
                .build();

        Grade savedGrade = gradeRepository.save(grade);

        // Handle lesson associations if present
        if (gradeDto.getLessonIds() != null && !gradeDto.getLessonIds().isEmpty()) {
            gradeDto.getLessonIds().forEach(lessonId -> {
                lessonRepository.findById(lessonId).ifPresent(lesson -> {
                    LessonGrade lessonGrade = LessonGrade.builder()
                            .lesson(lesson)
                            .grade(savedGrade)
                            .build();
                    lessonGradeRepository.save(lessonGrade);
                });
            });
        }

        return convertToResponse(savedGrade);
    }

    @Override
    @Transactional
    public GradeResponse update(Long id, GradeDto gradeDto) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found"));

        // Check name uniqueness if name is being changed
        if (!grade.getName().equals(gradeDto.getName()) &&
                gradeRepository.existsByName(gradeDto.getName())) {
            throw new RuntimeException("Grade with this name already exists");
        }

        grade.setName(gradeDto.getName());
        grade.setDescription(gradeDto.getDescription());

        Grade updatedGrade = gradeRepository.save(grade);

        // Update lesson associations
        lessonGradeRepository.deleteByGradeId(updatedGrade.getId());

        if (gradeDto.getLessonIds() != null && !gradeDto.getLessonIds().isEmpty()) {
            gradeDto.getLessonIds().forEach(lessonId -> {
                lessonRepository.findById(lessonId).ifPresent(lesson -> {
                    LessonGrade lessonGrade = LessonGrade.builder()
                            .lesson(lesson)
                            .grade(updatedGrade)
                            .build();
                    lessonGradeRepository.save(lessonGrade);
                });
            });
        }

        return convertToResponse(updatedGrade);
    }

    @Override
    public GradeResponse findById(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found"));
        return convertToResponse(grade);
    }

    @Override
    public List<GradeResponse> findAll() {
        return gradeRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!gradeRepository.existsById(id)) {
            throw new RuntimeException("Grade not found");
        }
        lessonGradeRepository.deleteByGradeId(id);
        gradeRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradeResponse> findByLessonId(Long lessonId) {
        return lessonGradeRepository.findByLessonId(lessonId).stream()
                .map(LessonGrade::getGrade)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private GradeResponse convertToResponse(Grade grade) {
        List<Long> lessonIds = lessonGradeRepository.findByGradeId(grade.getId()).stream()
                .map(lg -> lg.getLesson().getId())
                .collect(Collectors.toList());

        return GradeResponse.builder()
                .id(grade.getId())
                .name(grade.getName())
                .description(grade.getDescription())
//                .lessonIds(lessonIds)
                .createdAt(grade.getCreatedAt())
                .updatedAt(grade.getUpdatedAt())
                .build();
    }
}
