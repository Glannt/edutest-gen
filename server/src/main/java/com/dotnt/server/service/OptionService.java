package com.dotnt.server.service;


import com.dotnt.server.dto.OptionDto;
import com.dotnt.server.entity.Option;

import java.util.List;
import java.util.Optional;

public interface OptionService {
    OptionDto save(OptionDto option);
    Optional<OptionDto> findById(Long id);
    List<OptionDto> findAll();
    void deleteById(Long id);
    OptionDto update(Long id, OptionDto optionDto);
}
