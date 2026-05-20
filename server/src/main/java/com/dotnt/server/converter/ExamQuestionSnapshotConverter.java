package com.dotnt.server.converter;

import com.dotnt.server.dto.ExamQuestionSnapshotDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class ExamQuestionSnapshotConverter implements AttributeConverter<List<ExamQuestionSnapshotDto>, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<ExamQuestionSnapshotDto> attribute) {
        if (attribute == null) return null;
        try {
            return mapper.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new RuntimeException("Error converting ExamQuestionSnapshot list to JSON", e);
        }
    }

    @Override
    public List<ExamQuestionSnapshotDto> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return null;
        try {
            return mapper.readValue(dbData, new TypeReference<List<ExamQuestionSnapshotDto>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Error converting JSON to ExamQuestionSnapshot list", e);
        }
    }
}
