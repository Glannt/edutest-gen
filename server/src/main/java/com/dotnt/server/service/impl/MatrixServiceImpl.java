package com.dotnt.server.service.impl;

import com.dotnt.server.dto.LevelDto;
import com.dotnt.server.dto.request.MatrixRequest;
import com.dotnt.server.dto.response.LessonResponse;
import com.dotnt.server.dto.response.MatrixDetailResponse;
import com.dotnt.server.dto.response.MatrixResponse;
import com.dotnt.server.entity.*;
import com.dotnt.server.repository.*;
import com.dotnt.server.service.MatrixService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@RequiredArgsConstructor
public class MatrixServiceImpl implements MatrixService {
    private final MatrixRepository matrixRepository;
    private final LevelRepository levelRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final QuestionTypeRepository questionTypeRepository;

    @Override
    public MatrixResponse save(MatrixRequest request) {
        Matrix matrix = this.toEntity(request);

        // 🔹 Tính percent tự động cho từng MatrixDetail
        this.calculateMatrixPercent(matrix);

        Matrix saved = matrixRepository.save(matrix);
        return this.toResponse(saved);
    }

    @Override
    public MatrixResponse findById(Long id) {
        return this.toResponse(matrixRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matrix not found")));
    }

    @Override
    public Page<MatrixResponse> findAll(Pageable pageable) {
        return matrixRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Override
    public List<MatrixResponse> findAll() {
        return matrixRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        matrixRepository.deleteById(id);
    }

    @Override
    public MatrixResponse update(Long id,MatrixRequest matrix) {
        Matrix exiting = matrixRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matrix not found with id" + id));
        return this.toResponse(matrixRepository.save(this.toEntity(matrix)));
    }

    /**
     * Export 1 ma trận -> Excel
     */
    @Override
    public ByteArrayInputStream exportMatrixToExcel(Long matrixId) throws IOException {
        Matrix matrix = matrixRepository.findById(matrixId)
                .orElseThrow(() -> new RuntimeException("Matrix not found: " + matrixId));

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet(matrix.getName());

            // ==== STYLE SETUP ====
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 11);
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setAlignment(HorizontalAlignment.CENTER);
            cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            cellStyle.setBorderTop(BorderStyle.THIN);
            cellStyle.setBorderBottom(BorderStyle.THIN);
            cellStyle.setBorderLeft(BorderStyle.THIN);
            cellStyle.setBorderRight(BorderStyle.THIN);

            int rowIdx = 0;

            // ==== TIÊU ĐỀ CHÍNH ====
            Row titleRow = sheet.createRow(rowIdx++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("Ma trận đề thi: " + matrix.getName());
            titleCell.setCellStyle(headerStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 8));

            rowIdx++; // dòng trống

            // ==== HEADER ====
            Row header = sheet.createRow(rowIdx++);
            String[] headers = {"Chương", "Chủ đề", "Cấp độ tư duy - Biết", "Hiểu", "VD", "Tổng", "Tỉ lệ (%)"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // ==== DỮ LIỆU CHI TIẾT ====
            double totalPercent = 0;
            int totalQuestion = 0;

            for (MatrixDetail detail : matrix.getMatrixDetails()) {
                Row row = sheet.createRow(rowIdx++);

                String lessonName = detail.getLesson() != null ? detail.getLesson().getName() : "-";
                String chapterName = detail.getLesson()
                        != null ? detail.getLesson().getChapter().getName() : "-";
                String levelName = detail.getLevel() != null ? detail.getLevel().getName() : "-";
                Integer qCount = detail.getQuestionCount() != null ? detail.getQuestionCount() : 0;
                Double percent = detail.getPercent() != null ? detail.getPercent() : 0.0;

                row.createCell(0).setCellValue(chapterName);
                row.createCell(1).setCellValue(lessonName);
                row.createCell(2).setCellValue(levelName.contains("Biết") ? qCount : 0);
                row.createCell(3).setCellValue(levelName.contains("Hiểu") ? qCount : 0);
                row.createCell(4).setCellValue(levelName.contains("VD") ? qCount : 0);
                row.createCell(5).setCellValue(qCount);
                row.createCell(6).setCellValue(percent);

                for (int i = 0; i <= 6; i++) row.getCell(i).setCellStyle(cellStyle);

                totalQuestion += qCount;
                totalPercent += percent;
            }

            // ==== DÒNG TỔNG ====
            Row totalRow = sheet.createRow(rowIdx++);
            Cell totalLabel = totalRow.createCell(1);
            totalLabel.setCellValue("Tổng");
            totalLabel.setCellStyle(headerStyle);
            totalRow.createCell(5).setCellValue(totalQuestion);
            totalRow.createCell(6).setCellValue(totalPercent);
            for (int i = 0; i <= 6; i++) {
                if (totalRow.getCell(i) == null) totalRow.createCell(i);
                totalRow.getCell(i).setCellStyle(headerStyle);
            }

            for (int i = 0; i <= 6; i++) sheet.autoSizeColumn(i);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    /**
     * Export nhiều ma trận -> Zip chứa nhiều file Excel
     */
    @Override
    public ByteArrayInputStream exportMultipleMatrixToZip(List<Long> matrixIds) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zipOut = new ZipOutputStream(baos)) {
            for (Long id : matrixIds) {
                ByteArrayInputStream matrixStream = exportMatrixToExcel(id);
                ZipEntry zipEntry = new ZipEntry("matrix_" + id + ".xlsx");
                zipOut.putNextEntry(zipEntry);
                matrixStream.transferTo(zipOut);
                zipOut.closeEntry();
            }
        }
        return new ByteArrayInputStream(baos.toByteArray());
    }

    @Override
    public List<MatrixResponse> findByGradeAndSubject(Long gradeId, Long subjectId) {
        if (gradeId == null) {
            throw new IllegalArgumentException("gradeId cannot be null");
        }

        if (subjectId != null) {
            return matrixRepository.findByGradeIdAndSubjectId(gradeId, subjectId)
                    .stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
        } else {
            return matrixRepository.findByGradeId(gradeId)
                    .stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
        }
    }

    private MatrixResponse toResponse(Matrix matrix) {
        return MatrixResponse.builder()
                .id(matrix.getId())
                .name(matrix.getName())
                .description(matrix.getDescription())
                .totalQuestions(matrix.getTotalQuestions())
                .matrixDetails(matrix.getMatrixDetails().stream()
                        .map(detail -> MatrixDetailResponse.builder()
                                .id(detail.getId())
                                .lesson(LessonResponse
                                        .builder()
                                        .id(detail.getLesson().getId())
                                        .name(detail.getLesson().getName())
                                        .description(detail.getLesson().getDescription())
                                        .orderIndex(detail.getLesson().getOrderIndex())
                                        .build())
                                .chapterName(detail.getLesson().getChapter().getName())
                                .level(LevelDto
                                        .builder()
                                        .id(detail.getLevel().getId())
                                        .name(detail.getLevel().getName())
                                        .description(detail.getLevel().getDescription())
                                        .points(detail.getLevel().getPoints())
                                        .build())
                                .questionType(detail.getQuestionType().getName())
                                .matrixName(detail.getMatrix().getName())
                                .percent(matrix.getTotalQuestions() == 0 ? 0d : (detail.getQuestionCount() * 100 / matrix.getTotalQuestions()))
                                .quantity(detail.getQuestionCount())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    private Matrix toEntity(MatrixRequest request) {
        Matrix matrix = Matrix.builder()
                .name(request.getName())
                .description(request.getDescription())
                .totalQuestions(request.getTotalQuestions())
                .user(userRepository.findByUsernameOrEmail(
                                SecurityContextHolder.getContext().getAuthentication().getName())
                        .orElseThrow(() -> new RuntimeException("User not found")))
                .build();

        if (request.getMatrixDetails() != null && !request.getMatrixDetails().isEmpty()) {
            Set<MatrixDetail> matrixDetails = request.getMatrixDetails().stream()
                    .map(detailReq -> MatrixDetail.builder()
                            .lesson(lessonRepository.findById(detailReq.getLessonId())
                                    .orElseThrow(() -> new RuntimeException(
                                            "Lesson not found with id " + detailReq.getLessonId())))
                            .level(levelRepository.findById(detailReq.getLevelId())
                                    .orElseThrow(() -> new RuntimeException(
                                            "Level not found with id " + detailReq.getLevelId())))
                            .questionType(questionTypeRepository.findById(detailReq.getQuestionTypeId())
                                    .orElseThrow(() -> new RuntimeException(
                                    "Question not found with id " + detailReq.getQuestionTypeId())))
                            .questionCount(detailReq.getQuantity())
                            .matrix(matrix)
                            .build())
                    .collect(Collectors.toSet());

            matrix.setMatrixDetails(matrixDetails);
        }

        return matrix;
    }

    /**
     * Tự động tính phần trăm (%) phân bố câu hỏi giữa các MatrixDetail
     */
    private void calculateMatrixPercent(Matrix matrix) {
        if (matrix.getMatrixDetails() == null || matrix.getMatrixDetails().isEmpty()) {
            return;
        }

        int totalQuestions = matrix.getTotalQuestions() != null ? matrix.getTotalQuestions() : 0;

        if (totalQuestions <= 0) {
            // Tổng câu hỏi = tổng của các detail nếu user chưa nhập
            totalQuestions = matrix.getMatrixDetails().stream()
                    .mapToInt(MatrixDetail::getQuestionCount)
                    .sum();
            matrix.setTotalQuestions(totalQuestions);
        }

        final int finalTotalQuestions = totalQuestions;

        // 🔹 Tính phần trăm cho từng MatrixDetail
        matrix.getMatrixDetails().forEach(detail -> {
            int qCount = detail.getQuestionCount() != null ? detail.getQuestionCount() : 0;
            double percent = finalTotalQuestions == 0 ? 0.0 : ((double) qCount / finalTotalQuestions) * 100;
            detail.setPercent(percent);
        });

        // 🔹 (Optional) Normalize nếu tổng % ≠ 100
        double totalPercent = matrix.getMatrixDetails().stream()
                .mapToDouble(MatrixDetail::getPercent)
                .sum();

        if (Math.abs(totalPercent - 100.0) > 0.01) {
            double factor = 100.0 / totalPercent;
            matrix.getMatrixDetails().forEach(d -> d.setPercent(d.getPercent() * factor));
        }
    }
}
