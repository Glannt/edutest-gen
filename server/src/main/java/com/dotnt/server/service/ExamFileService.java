package com.dotnt.server.service;

import com.itextpdf.text.DocumentException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ExamFileService {
    ResponseEntity<InputStreamResource> exportSingleExam(Long examId, String format) throws IOException, DocumentException;

    List<String> exportMultipleExams(List<Long> examIds, String format) throws IOException;

    void importExamFromFile(MultipartFile file) throws IOException;
}
