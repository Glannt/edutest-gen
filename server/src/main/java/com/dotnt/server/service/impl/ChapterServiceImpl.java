package com.dotnt.server.service.impl;

import com.dotnt.server.dto.request.ChapterRequest;
import com.dotnt.server.dto.response.ChapterResponse;
import com.dotnt.server.entity.Chapter;
import com.dotnt.server.repository.ChapterRepository;
import com.dotnt.server.repository.SubjectRepository;
import com.dotnt.server.service.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChapterServiceImpl implements ChapterService{
        private final ChapterRepository chapterRepository;
        private final SubjectRepository subjectRepository;

    @Override
    public ChapterResponse save(ChapterRequest chapter) {
        Chapter chapterSaved = chapterRepository.save(Chapter.builder()
                .name(chapter.getName())
                .description(chapter.getDescription())
                        .subject(subjectRepository.findById(chapter.getSubjectId())
                                .orElseThrow(() -> new RuntimeException("Subject not found")))
                .build());

        return ChapterResponse.builder()
                .name(chapterSaved.getName())
                .description(chapterSaved.getDescription())
                .build() ;
    }

    @Override
    public Optional<ChapterResponse> findById(Long id) {
        return chapterRepository.findById(id)
                .map(chapter -> ChapterResponse.builder()
                        .id(chapter.getId())
                        .name(chapter.getName())
                        .description(chapter.getDescription())
                        .build());
    }

    @Override
    public List<ChapterResponse> findAll() {
        return chapterRepository.findAll().stream()
                .map(chapter -> ChapterResponse.builder()
                        .id(chapter.getId())
                        .name(chapter.getName())
                        .description(chapter.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        chapterRepository.deleteById(id);
    }

    @Override
    public ChapterResponse update(ChapterRequest chapter) {
        if (chapter.getId() == null) {
            throw new RuntimeException("Chapter ID cannot be null for update");
        }
        Chapter chapterSaved = chapterRepository.save(Chapter.builder()
                .id(chapter.getId())
                .name(chapter.getName())
                .description(chapter.getDescription())
                .build());
        return ChapterResponse.builder()
                .id(chapterSaved.getId())
                .name(chapterSaved.getName())
                .description(chapterSaved.getDescription())
                .build();
    }
}
