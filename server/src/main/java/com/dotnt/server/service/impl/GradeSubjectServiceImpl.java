package com.dotnt.server.service.impl;

import com.dotnt.server.dto.SubjectDto;
import com.dotnt.server.dto.response.ChapterResponse;
import com.dotnt.server.entity.Chapter;
import com.dotnt.server.entity.Subject;
import com.dotnt.server.repository.GradeSubjectChapterRepository;
import com.dotnt.server.repository.GradeSubjectRepository;
import com.dotnt.server.service.GradeSubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GradeSubjectServiceImpl implements GradeSubjectService {
    private final GradeSubjectRepository gradeSubjectRepository;
    private final GradeSubjectChapterRepository gradeSubjectChapterRepository;

    @Override
    public List<SubjectDto> getSubjectsByGrade(Long gradeId) {
        List<Subject> subjects = gradeSubjectRepository.findSubjectsByGradeId(gradeId);
        return subjects.stream()
                .map(this::mapToSubjectDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ChapterResponse> getChaptersByGradeAndSubject(Long gradeId, Long subjectId) {
        List<Chapter> chapters = gradeSubjectChapterRepository.findChaptersByGradeAndSubject(gradeId, subjectId);
        return chapters.stream()
                .map(this::mapToChapterDTO)
                .collect(Collectors.toList());
    }

    private SubjectDto mapToSubjectDTO(Subject subject) {
        return SubjectDto.builder()
                .id(subject.getId())
                .name(subject.getName())
                .description(subject.getDescription())
                .build();
    }

    private ChapterResponse mapToChapterDTO(Chapter chapter) {
        return ChapterResponse.builder()
                .id(chapter.getId())
                .name(chapter.getName())
                .description(chapter.getDescription())
                .orderIndex(chapter.getOrderIndex())
                .build();
    }
}
