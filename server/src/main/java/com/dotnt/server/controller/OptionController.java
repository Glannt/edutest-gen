package com.dotnt.server.controller;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.OptionDto;
import com.dotnt.server.service.OptionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/options")
@RestResponse
@RequiredArgsConstructor
public class OptionController {

    private final OptionService optionService;

    // GET /options → 200 OK
    @GetMapping
    public List<OptionDto> getAllOptions() {
        return optionService.findAll();
    }

    // GET /options/{id} → 200 OK hoặc 404 Not Found
    @GetMapping("/{id}")
    public OptionDto getOptionById(@PathVariable Long id) {
        return optionService.findById(id).orElseThrow(() -> new EntityNotFoundException("Option not found with id " + id));
    }

    // POST /options → 201 Created
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OptionDto createOption(@RequestBody OptionDto optionDto) {
        OptionDto saved = optionService.save(optionDto);

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

    // PUT /options/{id} → 200 OK
    @PutMapping("/{id}")
    public OptionDto updateOption(@PathVariable Long id, @RequestBody OptionDto optionDto) {
        return optionService.update(id, optionDto);
    }

    // DELETE /options/{id} → 204 No Content
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOption(@PathVariable Long id) {
        optionService.deleteById(id);
    }
}