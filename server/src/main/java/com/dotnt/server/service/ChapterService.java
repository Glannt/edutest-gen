package com.dotnt.server.service;

import com.dotnt.server.dto.request.ChapterRequest;
import com.dotnt.server.dto.response.ChapterResponse;

import java.util.List;
import java.util.Optional;

public interface ChapterService {
    ChapterResponse save(ChapterRequest chapter);
    Optional<ChapterResponse> findById(Long id);
    List<ChapterResponse> findAll();
    void deleteById(Long id);
    ChapterResponse update(ChapterRequest chapter);
}
