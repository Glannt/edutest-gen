package com.dotnt.server.converter;

import com.dotnt.server.dto.ContentBlockDto;
import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

@Converter
public class ContentBlockConverter implements AttributeConverter<List<ContentBlockDto>, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<ContentBlockDto> attribute) {
        if (attribute == null) return null;
        try {
            return mapper.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new RuntimeException("Error converting contentJson to JSON", e);
        }
    }

    @Override
    public List<ContentBlockDto> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return null;
        try {
            return mapper.readValue(dbData, new TypeReference<List<ContentBlockDto>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Error converting JSON to contentJson", e);
        }
    }
}

