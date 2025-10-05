package com.dotnt.server.service;

import com.dotnt.server.dto.SubjectDto;
import com.dotnt.server.entity.Grade;
import com.dotnt.server.entity.Subject;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface SubjectService {
    SubjectDto create(SubjectDto subjectDto);
    SubjectDto update(Long id, SubjectDto subjectDto);
    Optional<SubjectDto> findById(Long id);
    List<SubjectDto> findAll();
    void deleteById(Long id);
    List<SubjectDto> findByNameContaining(String name);

    Subject addGradeToSubject(Long subjectId, Long gradeId);
    Subject removeGradeFromSubject(Long subjectId, Long gradeId);
    Set<Grade> getGradesOfSubject(Long subjectId);
}
