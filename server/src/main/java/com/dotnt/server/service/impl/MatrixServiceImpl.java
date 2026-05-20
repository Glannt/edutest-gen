package com.dotnt.server.service.impl;

import com.dotnt.server.dto.LevelDto;
import com.dotnt.server.dto.request.MatrixDetailRequest;
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
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public MatrixResponse update(Long id, MatrixRequest request) {
        Matrix existing = matrixRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matrix not found with id: " + id));

        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setTotalQuestions(request.getTotalQuestions());

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));
            existing.setUser(user);
        }

        // Xóa toàn bộ detail cũ trên cùng danh sách
        existing.getMatrixDetails().clear();

        if (request.getMatrixDetails() != null && !request.getMatrixDetails().isEmpty()) {
            for (MatrixDetailRequest detailReq : request.getMatrixDetails()) {
                MatrixDetail detail = new MatrixDetail();
                detail.setMatrix(existing);

                Level level = levelRepository.findById(detailReq.getLevelId())
                        .orElseThrow(() -> new RuntimeException("Level not found with id: " + detailReq.getLevelId()));
                Lesson lesson = lessonRepository.findById(detailReq.getLessonId())
                        .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + detailReq.getLessonId()));
                QuestionType qType = questionTypeRepository.findById(detailReq.getQuestionTypeId())
                        .orElseThrow(() -> new RuntimeException("QuestionType not found with id: " + detailReq.getQuestionTypeId()));

                detail.setLevel(level);
                detail.setLesson(lesson);
                detail.setQuestionType(qType);
                detail.setQuestionCount(detailReq.getQuantity());

                // ✅ add trực tiếp vào list đang được quản lý
                existing.getMatrixDetails().add(detail);
            }
        }

        Matrix saved = matrixRepository.save(existing);
        return this.toResponse(saved);
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
            headerStyle.setWrapText(true);

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
            titleCell.setCellValue("MA TRẬN ĐỀ THI: " + matrix.getName());
            titleCell.setCellStyle(headerStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 14)); // gộp từ cột 0 đến 14

            rowIdx++; // dòng trống

            // ==== HEADER 3 TẦNG ====
            Row header1 = sheet.createRow(rowIdx++);
            Row header2 = sheet.createRow(rowIdx++);
            Row header3 = sheet.createRow(rowIdx++);

            // --- Tầng 1 ---
            createHeaderCell(header1, 0, "CHƯƠNG", headerStyle);
            sheet.addMergedRegion(new CellRangeAddress(2, 4, 0, 0));

            createHeaderCell(header1, 1, "NỘI DUNG/ĐƠN VỊ KIẾN THỨC", headerStyle);
            sheet.addMergedRegion(new CellRangeAddress(2, 4, 1, 1));

            createHeaderCell(header1, 2, "MỨC ĐỘ NHẬN THỨC", headerStyle);
            sheet.addMergedRegion(new CellRangeAddress(2, 2, 2, 10));

            createHeaderCell(header1, 11, "TỔNG SỐ CÂU HỎI", headerStyle);
            sheet.addMergedRegion(new CellRangeAddress(2, 2, 11, 13));

            createHeaderCell(header1, 14, "TỔNG ĐIỂM %", headerStyle);
            sheet.addMergedRegion(new CellRangeAddress(2, 4, 14, 14));

            // --- Tầng 2 ---
            String[] levelGroups = {"NB", "TH", "VD"};
            int col = 2;
            for (String group : levelGroups) {
                createHeaderCell(header2, col, group, headerStyle);
                sheet.addMergedRegion(new CellRangeAddress(3, 3, col, col + 2));
                col += 3;
            }

            String[] totalGroup = {"TN", "D-S", "TL-N"};
            for (int i = 0; i < totalGroup.length; i++) {
                createHeaderCell(header2, 11 + i, totalGroup[i], headerStyle);
                sheet.addMergedRegion(new CellRangeAddress(3, 4, 11 + i, 11 + i));
            }

            // --- Tầng 3 ---
            String[] subCols = {"TN", "D-S", "TL-N", "TN", "D-S", "TL-N", "TN", "D-S", "TL-N"};
            for (int i = 0; i < subCols.length; i++) {
                createHeaderCell(header3, 2 + i, subCols[i], headerStyle);
            }

            // ==== DỮ LIỆU CHI TIẾT ====
            for (MatrixDetail detail : matrix.getMatrixDetails()) {
                Row row = sheet.createRow(rowIdx++);

                String chapterName = detail.getLesson() != null ? detail.getLesson().getChapter().getName() : "-";
                String lessonName = detail.getLesson() != null ? detail.getLesson().getName() : "-";
                String levelName = detail.getLevel() != null ? detail.getLevel().getName() : "-";
                Integer qCount = detail.getQuestionCount() != null ? detail.getQuestionCount() : 0;
                Double percent = detail.getPercent() != null ? detail.getPercent() : 0.0;

                row.createCell(0).setCellValue(chapterName);
                row.createCell(1).setCellValue(lessonName);

                // mapping theo cấp độ
                if (levelName.contains("NB")) row.createCell(2).setCellValue(qCount);
                if (levelName.contains("TH")) row.createCell(5).setCellValue(qCount);
                if (levelName.contains("VD")) row.createCell(8).setCellValue(qCount);

                // Tổng giả lập (có thể thay bằng tính toán thực)
                row.createCell(11).setCellValue(qCount);
                row.createCell(14).setCellValue(percent);

                for (int i = 0; i <= 14; i++) {
                    if (row.getCell(i) == null) row.createCell(i);
                    row.getCell(i).setCellStyle(cellStyle);
                }
            }

            // ==== DÒNG TỔNG ====
            Row totalRow = sheet.createRow(rowIdx++);
            totalRow.createCell(1).setCellValue("TỔNG");
            totalRow.getCell(1).setCellStyle(headerStyle);

            // ví dụ gán tổng cộng
            totalRow.createCell(11).setCellValue(matrix.getTotalQuestions());
            totalRow.createCell(14).setCellValue(100.0);

            for (int i = 0; i <= 14; i++) {
                if (totalRow.getCell(i) == null) totalRow.createCell(i);
                totalRow.getCell(i).setCellStyle(headerStyle);
            }

            for (int i = 0; i <= 14; i++) sheet.autoSizeColumn(i);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    /** Hàm helper để tạo ô header */
    private void createHeaderCell(Row row, int col, String value, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(value);
        cell.setCellStyle(style);
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
