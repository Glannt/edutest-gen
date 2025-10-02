package com.dotnt.server.controller;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.LevelDto;
import com.dotnt.server.service.LevelService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/levels")
@RestResponse
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')") // Chỉ cho phép ADMIN truy cập
public class LevelController {
    private final LevelService levelService;

    @GetMapping
    public List<LevelDto> getAllLevels() {
        return levelService.findAll();
    }

    @GetMapping("/{id}")
    public LevelDto getLevelById(@PathVariable Long id) {
        return levelService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Level not found with id " + id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LevelDto createLevel(@RequestBody LevelDto dto) {
        LevelDto saved = levelService.save(dto);

        // Optionally set Location header
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getId())
                .toUri();
        // Nếu muốn sử dụng header, có thể return ResponseEntity:
        // return ResponseEntity.created(location).body(saved);

        return saved;
    }

    @PutMapping("/{id}")
    public LevelDto updateLevel(@PathVariable Long id, @RequestBody LevelDto dto) {
        return levelService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLevel(@PathVariable Long id) {
        levelService.deleteById(id);
    }

}
