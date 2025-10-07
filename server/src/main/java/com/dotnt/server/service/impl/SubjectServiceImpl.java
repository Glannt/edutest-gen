package com.dotnt.server.service.impl;


import com.dotnt.server.dto.SubjectDto;
import com.dotnt.server.dto.response.ChapterResponse;
import com.dotnt.server.entity.Grade;
import com.dotnt.server.entity.GradeSubject;
import com.dotnt.server.entity.Subject;
import com.dotnt.server.entity.User;
import com.dotnt.server.repository.GradeRepository;
import com.dotnt.server.repository.GradeSubjectRepository;
import com.dotnt.server.repository.SubjectRepository;
import com.dotnt.server.repository.UserRepository;
import com.dotnt.server.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {
    private final SubjectRepository subjectRepository;
    private final GradeRepository gradeRepository;
    private final GradeSubjectRepository gradeSubjectRepository;
    @Override
    @Transactional
    public SubjectDto create(SubjectDto subjectDto) {
        if (subjectRepository.existsByName(subjectDto.getName())) {
            throw new RuntimeException("Subject with this name already exists");
        }



        Subject subject = Subject.builder()
                .name(subjectDto.getName())
                .description(subjectDto.getDescription())
                .build();

        Subject savedSubject = subjectRepository.save(subject);
        return convertToDto(savedSubject);
    }

    @Override
    @Transactional
    public SubjectDto update(Long id, SubjectDto subjectDto) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        subject.setName(subjectDto.getName());
        subject.setDescription(subjectDto.getDescription());

        Subject updatedSubject = subjectRepository.save(subject);
        return convertToDto(updatedSubject);
    }

    @Override
    public Optional<SubjectDto> findById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        return Optional.ofNullable(convertToDto(subject));
    }

    @Override
    public List<SubjectDto> findAll() {
        return subjectRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new RuntimeException("Subject not found");
        }
        subjectRepository.deleteById(id);
    }

    @Override
    public List<SubjectDto> findByNameContaining(String name) {
        List<Subject> subjects = subjectRepository.findByNameContaining(name);
        return subjects.stream()
                .map(s -> SubjectDto.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .description(s.getDescription())
                        .createdAt(s.getCreatedAt())
                        .updatedAt(s.getUpdatedAt())
                        .build()
                )
                .collect(Collectors.toList());
    }

    private SubjectDto convertToDto(Subject subject) {
        return SubjectDto.builder()
                .id(subject.getId())
                .name(subject.getName())
                .description(subject.getDescription())
                .createdAt(subject.getCreatedAt())
                .updatedAt(subject.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public Subject addGradeToSubject(Long subjectId, Long gradeId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new RuntimeException("Grade not found"));

        // Kiểm tra đã tồn tại chưa
        boolean exists = gradeSubjectRepository.existsByGradeAndSubject(grade, subject);
        if (exists) {
            throw new IllegalStateException("Grade already assigned to Subject");
        }

        GradeSubject gradeSubject = GradeSubject.builder()
                .grade(grade)
                .subject(subject)
                .build();
        return subjectRepository.save(subject);
    }

    // Xóa grade khỏi subject
    @Override
    @Transactional
    public Subject removeGradeFromSubject(Long subjectId, Long gradeId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new RuntimeException("Grade not found"));

        gradeSubjectRepository.deleteByGradeAndSubject(grade, subject);
        return subjectRepository.save(subject);
    }

    // Lấy tất cả grade của subject
    @Override
    @Transactional(readOnly = true)
    public Set<Grade> getGradesOfSubject(Long subjectId) {
        List<GradeSubject> gradeSubjects = gradeSubjectRepository.findBySubjectId(subjectId);
        return gradeSubjects.stream()
                .map(GradeSubject::getGrade)
                .collect(Collectors.toSet());
    }
}
