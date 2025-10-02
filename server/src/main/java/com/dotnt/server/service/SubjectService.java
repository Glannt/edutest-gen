package com.dotnt.server.service;

import com.dotnt.server.dto.SubjectDto;

import java.util.List;
import java.util.Optional;

public interface SubjectService {
    SubjectDto create(SubjectDto subjectDto);
    SubjectDto update(Long id, SubjectDto subjectDto);
    Optional<SubjectDto> findById(Long id);
    List<SubjectDto> findAll();
    void deleteById(Long id);
    List<SubjectDto> findByNameContaining(String name);
}
