package com.dotnt.server.service.impl;

import com.dotnt.server.dto.GradeDto;
import com.dotnt.server.dto.response.GradeResponse;
import com.dotnt.server.entity.Grade;
import com.dotnt.server.entity.User;
import com.dotnt.server.repository.GradeRepository;
import com.dotnt.server.repository.LessonRepository;
import com.dotnt.server.repository.UserRepository;
import com.dotnt.server.service.GradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradeServiceImpl implements GradeService {
    private final GradeRepository gradeRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;


    @Override
    @Transactional
    public GradeResponse create(GradeDto gradeDto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Check if grade with same name already exists
        if (gradeRepository.existsByName(gradeDto.getName())) {
            throw new RuntimeException("Grade with this name already exists");
        }

        Grade grade = Grade.builder()
                .name(gradeDto.getName())
                .description(gradeDto.getDescription())
                .created_by(user.getFullName())
                .build();

        Grade savedGrade = gradeRepository.save(grade);
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


        return convertToResponse(updatedGrade);
    }

    @Override
    public GradeResponse findById(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found"));
        return convertToResponse(grade);
    }

    @Override
    public Page<GradeResponse> findAllPaged(Pageable pageable) {
        return gradeRepository.findAll(pageable)
                .map(this::convertToResponse);
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
        gradeRepository.deleteById(id);
    }


    private GradeResponse convertToResponse(Grade grade) {
        return GradeResponse.builder()
                .id(grade.getId())
                .name(grade.getName())
                .description(grade.getDescription())
                .createdAt(grade.getCreatedAt())
                .updatedAt(grade.getUpdatedAt())
                .build();
    }
}
