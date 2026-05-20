package com.dotnt.server.service.impl;

import com.dotnt.server.dto.ContentBlockDto;
import com.dotnt.server.dto.ExamQuestionSnapshotDto;
import com.dotnt.server.dto.OptionDto;
import com.dotnt.server.entity.Exam;
import com.dotnt.server.entity.ExamQuestion;
import com.dotnt.server.entity.Option;
import com.dotnt.server.entity.Question;
import com.dotnt.server.repository.ExamRepository;
import com.dotnt.server.service.ExamFileService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.DocumentException;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xwpf.usermodel.*;
import org.apache.poi.xwpf.model.XWPFHeaderFooterPolicy;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamFileServiceImpl implements ExamFileService {

    private final ExamRepository examRepository;

    @Override
    public ResponseEntity<InputStreamResource> exportSingleExam(Long examId, String format) throws IOException, DocumentException {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        if (format.equalsIgnoreCase("pdf")) {
            return generatePdf(exam);
        } else {
            return generateWord(exam);
        }
    }

    @Override
    public List<String> exportMultipleExams(List<Long> examIds, String format) throws IOException {
        List<String> exportedFiles = new ArrayList<>();

        for (Long id : examIds) {
            Exam exam = examRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Exam not found: " + id));

            String fileName;
            if (format.equalsIgnoreCase("pdf")) {
                fileName = savePdfToDisk(exam);
            } else {
                fileName = saveWordToDisk(exam);
            }
            exportedFiles.add(fileName);
        }

        return exportedFiles; // trả về danh sách path để client tải về
    }

    @Override
    public void importExamFromFile(MultipartFile file) throws IOException {
        // 🚧 Giản lược — có thể mở rộng đọc file Word/PDF để tạo exam mới
        // Ví dụ: Dùng Apache POI để parse docx, hoặc PDFBox để đọc PDF text
        System.out.println("Import file: " + file.getOriginalFilename());
    }

    // ====== Export to Word ======
    private ResponseEntity<InputStreamResource> generateWord(Exam exam) throws IOException {
        XWPFDocument doc = buildExamDocument(exam);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        doc.write(out);
        doc.close();

        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(out.toByteArray()));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + exam.getCode() + ".docx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .body(resource);
    }

    private String saveWordToDisk(Exam exam) throws IOException {
        XWPFDocument doc = buildExamDocument(exam);
        String fileName = "exported/exam_" + exam.getCode() + ".docx";
        Files.createDirectories(Paths.get("exported"));
        try (FileOutputStream out = new FileOutputStream(fileName)) {
            doc.write(out);
        }
        doc.close();
        return fileName;
    }

    private XWPFDocument buildExamDocument(Exam exam) {
        XWPFDocument doc = new XWPFDocument();

        // Enable different first page for headers/footers in Word
        org.openxmlformats.schemas.wordprocessingml.x2006.main.CTSectPr sectPr = doc.getDocument().getBody().getSectPr();
        if (sectPr == null) sectPr = doc.getDocument().getBody().addNewSectPr();
        sectPr.addNewTitlePg();

        // Add default header for page 2 onwards (top right)
        XWPFHeader defaultHeader = doc.createHeader(XWPFHeaderFooterPolicy.DEFAULT);
        XWPFParagraph headerParagraph = defaultHeader.createParagraph();
        headerParagraph.setAlignment(ParagraphAlignment.RIGHT);
        XWPFRun headerRun = headerParagraph.createRun();
        headerRun.setFontSize(8);
        headerRun.setText("Mã đề: " + exam.getCode());

        // First page header table
        XWPFTable headerTable = doc.createTable(1, 2);
        headerTable.getCTTbl().getTblPr().unsetTblBorders();

        // Left Cell (School info and Boxed Exam Code)
        XWPFTableCell leftCell = headerTable.getRow(0).getCell(0);
        leftCell.getCTTc().addNewTcPr().addNewTcW().setW(java.math.BigInteger.valueOf(4500));
        XWPFParagraph pLeft1 = leftCell.getParagraphs().get(0);
        pLeft1.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun rLeft1 = pLeft1.createRun();
        rLeft1.setFontSize(10);
        rLeft1.setText("UBND THÀNH PHỐ VŨNG TÀU");

        XWPFParagraph pLeft2 = leftCell.createParagraph();
        pLeft2.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun rLeft2 = pLeft2.createRun();
        rLeft2.setBold(true);
        rLeft2.setFontSize(10);
        rLeft2.setText("TRƯỜNG THCS NGUYỄN GIA THIỀU");

        XWPFParagraph pSpace = leftCell.createParagraph();
        pSpace.setAlignment(ParagraphAlignment.CENTER);
        pSpace.setSpacingBefore(100);

        // Inner Box Table for Exam Code
        XWPFTable boxTable = leftCell.insertNewTbl(pSpace.getCTP().newCursor());
        boxTable.setTableAlignment(TableRowAlign.CENTER);
        XWPFTableCell boxCell = boxTable.getRow(0).getCell(0);
        boxCell.getCTTc().addNewTcPr().addNewTcW().setW(java.math.BigInteger.valueOf(1500));
        XWPFParagraph pBox = boxCell.getParagraphs().get(0);
        pBox.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun rBox = pBox.createRun();
        rBox.setBold(true);
        rBox.setFontSize(11);
        rBox.setText("Đề " + exam.getCode());

        // Right Cell (Exam Title)
        XWPFTableCell rightCell = headerTable.getRow(0).getCell(1);
        rightCell.getCTTc().addNewTcPr().addNewTcW().setW(java.math.BigInteger.valueOf(5500));

        XWPFParagraph pRight1 = rightCell.getParagraphs().get(0);
        pRight1.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun rRight1 = pRight1.createRun();
        rRight1.setBold(true);
        rRight1.setFontSize(12);
        rRight1.setText(exam.getName().toUpperCase());

        XWPFParagraph pRight2 = rightCell.createParagraph();
        pRight2.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun rRight2 = pRight2.createRun();
        rRight2.setFontSize(10);
        rRight2.setText("Thời gian làm bài: " + exam.getDurationMinutes() + " phút");

        XWPFParagraph pRight3 = rightCell.createParagraph();
        pRight3.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun rRight3 = pRight3.createRun();
        rRight3.setItalic(true);
        rRight3.setFontSize(9);
        rRight3.setText("(không kể thời gian phát đề)");

        // Separator spacing
        XWPFParagraph sep = doc.createParagraph();
        sep.setSpacingBefore(200);

        // Sub-header for Multiple Choice
        XWPFParagraph subTitle = doc.createParagraph();
        XWPFRun subRun = subTitle.createRun();
        subRun.setBold(true);
        subRun.setFontSize(11);
        subRun.setText("Phần 1: Trắc nghiệm (10 điểm) - Chọn đáp án đúng trong các đáp án sau:\n");

        int index = 1;
        if (exam.getQuestionsJson() != null && !exam.getQuestionsJson().isEmpty()) {
            for (ExamQuestionSnapshotDto q : exam.getQuestionsJson()) {
                // --- Question Content ---
                XWPFParagraph qPara = doc.createParagraph();
                qPara.setSpacingBefore(100);
                XWPFRun qRun = qPara.createRun();
                qRun.setText("Câu " + index++ + ": " + buildContentTextFromBlocks(q.getContentJson()));

                // --- Options (Side-by-side with tabs) ---
                List<OptionDto> options = new ArrayList<>(q.getOptions() != null ? q.getOptions() : List.of());
                options.sort(Comparator.comparing(OptionDto::getOrderIndex));

                XWPFParagraph optPara = doc.createParagraph();
                XWPFRun optRun = optPara.createRun();
                StringBuilder optSb = new StringBuilder();
                char label = 'A';
                for (OptionDto opt : options) {
                    String contentText = opt.getContent() == null ? "" : opt.getContent().stream()
                            .map(block -> {
                                if ("formula".equals(block.getType()) && block.getLatex() != null) {
                                    return "$" + block.getLatex() + "$";
                                } else if ("text".equals(block.getType()) && block.getValue() != null) {
                                    return block.getValue();
                                }
                                return "";
                            })
                            .collect(Collectors.joining(" "));
                    optSb.append("   ").append(label++).append(". ").append(contentText).append("\t\t");
                }
                optRun.setText(optSb.toString());

                // --- Explanation (if any) ---
                if (q.getExplanationJson() != null && !q.getExplanationJson().isEmpty()) {
                    XWPFParagraph expPara = doc.createParagraph();
                    XWPFRun expRun = expPara.createRun();
                    expRun.setItalic(true);
                    expRun.setColor("555555");
                    expRun.setText("Giải thích: " + buildContentTextFromBlocks(q.getExplanationJson()));
                }
            }
        } else {
            for (ExamQuestion eq : exam.getExamQuestions()) {
                Question q = eq.getQuestion();
                if (q == null) continue;

                // --- Question Content ---
                XWPFParagraph qPara = doc.createParagraph();
                qPara.setSpacingBefore(100);
                XWPFRun qRun = qPara.createRun();
                qRun.setText("Câu " + index++ + ": " + buildContentText(q));

                // --- Options (Side-by-side with tabs) ---
                List<Option> options = new ArrayList<>(q.getOptions());
                options.sort(Comparator.comparing(Option::getOrderIndex));

                XWPFParagraph optPara = doc.createParagraph();
                XWPFRun optRun = optPara.createRun();
                StringBuilder optSb = new StringBuilder();
                char label = 'A';
                for (Option opt : options) {
                    String contentText = opt.getContentJson().stream()
                            .map(block -> {
                                if ("formula".equals(block.getType()) && block.getLatex() != null) {
                                    return "$" + block.getLatex() + "$";
                                } else if ("text".equals(block.getType()) && block.getValue() != null) {
                                    return block.getValue();
                                }
                                return "";
                            })
                            .collect(Collectors.joining(" "));
                    optSb.append("   ").append(label++).append(". ").append(contentText).append("\t\t");
                }
                optRun.setText(optSb.toString());

                // --- Explanation (if any) ---
                if (q.getExplanationJson() != null && !q.getExplanationJson().isEmpty()) {
                    XWPFParagraph expPara = doc.createParagraph();
                    XWPFRun expRun = expPara.createRun();
                    expRun.setItalic(true);
                    expRun.setColor("555555");
                    expRun.setText("Giải thích: " + buildExplanationText(q));
                }
            }
        }

        return doc;
    }

    // ====== Export to PDF ======
    private com.itextpdf.text.Font getVietnameseFont(float size, int style) {
        com.itextpdf.text.FontFactory.registerDirectories();
        String[] fontNames = {"Arial", "Times New Roman", "DejaVu Sans", "Liberation Sans", "Helvetica"};
        for (String fontName : fontNames) {
            if (com.itextpdf.text.FontFactory.isRegistered(fontName)) {
                return com.itextpdf.text.FontFactory.getFont(fontName, "Identity-H", true, size, style);
            }
        }
        return com.itextpdf.text.FontFactory.getFont(com.itextpdf.text.FontFactory.HELVETICA, "Cp1258", size, style);
    }

    private static class ExamPageEvent extends com.itextpdf.text.pdf.PdfPageEventHelper {
        private final String examCode;
        private final com.itextpdf.text.Font headerFont;
        private final com.itextpdf.text.Font footerFont;

        public ExamPageEvent(String examCode, com.itextpdf.text.Font headerFont, com.itextpdf.text.Font footerFont) {
            this.examCode = examCode;
            this.headerFont = headerFont;
            this.footerFont = footerFont;
        }

        @Override
        public void onEndPage(com.itextpdf.text.pdf.PdfWriter writer, com.itextpdf.text.Document document) {
            int pageNumber = writer.getPageNumber();
            
            // Header for page 2 onwards (top right)
            if (pageNumber > 1) {
                com.itextpdf.text.pdf.PdfContentByte cb = writer.getDirectContent();
                com.itextpdf.text.Phrase headerPhrase = new com.itextpdf.text.Phrase("Mã đề: " + examCode, headerFont);
                com.itextpdf.text.pdf.ColumnText.showTextAligned(cb, com.itextpdf.text.Element.ALIGN_RIGHT, 
                    headerPhrase, document.right(), document.top() + 10, 0);
            }
            
            // Footer for all pages (bottom right)
            com.itextpdf.text.pdf.PdfContentByte cb = writer.getDirectContent();
            com.itextpdf.text.Phrase footerPhrase = new com.itextpdf.text.Phrase("Trang " + pageNumber, footerFont);
            com.itextpdf.text.pdf.ColumnText.showTextAligned(cb, com.itextpdf.text.Element.ALIGN_RIGHT, 
                footerPhrase, document.right(), document.bottom() - 15, 0);
        }
    }

    private ResponseEntity<InputStreamResource> generatePdf(Exam exam) throws IOException, DocumentException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        com.itextpdf.text.Document pdfDoc = new com.itextpdf.text.Document();
        com.itextpdf.text.pdf.PdfWriter writer = com.itextpdf.text.pdf.PdfWriter.getInstance(pdfDoc, out);
        
        // Fonts
        com.itextpdf.text.Font titleFont = getVietnameseFont(12, com.itextpdf.text.Font.BOLD);
        com.itextpdf.text.Font normalFont = getVietnameseFont(10, com.itextpdf.text.Font.NORMAL);
        com.itextpdf.text.Font boldFont = getVietnameseFont(10, com.itextpdf.text.Font.BOLD);
        com.itextpdf.text.Font italicFont = getVietnameseFont(9, com.itextpdf.text.Font.ITALIC);
        com.itextpdf.text.Font headerFont = getVietnameseFont(8, com.itextpdf.text.Font.NORMAL);
        
        // Register page event helper
        writer.setPageEvent(new ExamPageEvent(exam.getCode(), headerFont, normalFont));
        
        pdfDoc.open();

        // 2-column header layout for page 1
        com.itextpdf.text.pdf.PdfPTable headerTable = new com.itextpdf.text.pdf.PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{45f, 55f});

        // Left Cell (School Info & Boxed Exam Code)
        com.itextpdf.text.pdf.PdfPCell leftCell = new com.itextpdf.text.pdf.PdfPCell();
        leftCell.setBorder(com.itextpdf.text.Rectangle.NO_BORDER);
        leftCell.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
        
        com.itextpdf.text.Paragraph pLeft1 = new com.itextpdf.text.Paragraph("UBND THÀNH PHỐ VŨNG TÀU", normalFont);
        pLeft1.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
        leftCell.addElement(pLeft1);
        
        com.itextpdf.text.Paragraph pLeft2 = new com.itextpdf.text.Paragraph("TRƯỜNG THCS NGUYỄN GIA THIỀU", boldFont);
        pLeft2.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
        leftCell.addElement(pLeft2);
        
        com.itextpdf.text.Paragraph pSpacer = new com.itextpdf.text.Paragraph("\n");
        pSpacer.setLeading(5);
        leftCell.addElement(pSpacer);

        com.itextpdf.text.pdf.PdfPTable boxTable = new com.itextpdf.text.pdf.PdfPTable(1);
        boxTable.setWidthPercentage(40);
        com.itextpdf.text.pdf.PdfPCell boxCell = new com.itextpdf.text.pdf.PdfPCell(new com.itextpdf.text.Phrase("Đề " + exam.getCode(), boldFont));
        boxCell.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
        boxCell.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
        boxCell.setPadding(5);
        boxTable.addCell(boxCell);
        leftCell.addElement(boxTable);

        // Right Cell (Exam Title)
        com.itextpdf.text.pdf.PdfPCell rightCell = new com.itextpdf.text.pdf.PdfPCell();
        rightCell.setBorder(com.itextpdf.text.Rectangle.NO_BORDER);
        rightCell.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
        
        com.itextpdf.text.Paragraph pRight1 = new com.itextpdf.text.Paragraph(exam.getName().toUpperCase(), titleFont);
        pRight1.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
        rightCell.addElement(pRight1);
        
        com.itextpdf.text.Paragraph pRight2 = new com.itextpdf.text.Paragraph("Thời gian làm bài: " + exam.getDurationMinutes() + " phút", boldFont);
        pRight2.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
        rightCell.addElement(pRight2);
        
        com.itextpdf.text.Paragraph pRight3 = new com.itextpdf.text.Paragraph("(không kể thời gian phát đề)", italicFont);
        pRight3.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
        rightCell.addElement(pRight3);

        headerTable.addCell(leftCell);
        headerTable.addCell(rightCell);
        pdfDoc.add(headerTable);
        
        pdfDoc.add(new com.itextpdf.text.Paragraph("\n"));
        pdfDoc.add(new com.itextpdf.text.Paragraph("Phần 1: Trắc nghiệm (10 điểm) - Chọn đáp án đúng trong các đáp án sau:\n\n", boldFont));

        int i = 1;
        if (exam.getQuestionsJson() != null && !exam.getQuestionsJson().isEmpty()) {
            for (ExamQuestionSnapshotDto q : exam.getQuestionsJson()) {
                // --- Question Content ---
                pdfDoc.add(new com.itextpdf.text.Paragraph("Câu " + i++ + ": " + buildContentTextFromBlocks(q.getContentJson()), boldFont));

                // --- Options (4 columns) ---
                com.itextpdf.text.pdf.PdfPTable optionsTable = new com.itextpdf.text.pdf.PdfPTable(4);
                optionsTable.setWidthPercentage(100);
                optionsTable.setSpacingBefore(3);
                optionsTable.setSpacingAfter(3);
                
                List<OptionDto> options = new ArrayList<>(q.getOptions() != null ? q.getOptions() : List.of());
                options.sort(Comparator.comparing(OptionDto::getOrderIndex));
                char label = 'A';
                for (OptionDto opt : options) {
                    String contentText = opt.getContent() == null ? "" : opt.getContent().stream()
                            .map(block -> {
                                if ("formula".equals(block.getType()) && block.getLatex() != null) {
                                    return "$" + block.getLatex() + "$";
                                } else if ("text".equals(block.getType()) && block.getValue() != null) {
                                    return block.getValue();
                                }
                                return "";
                            })
                            .collect(Collectors.joining(" "));
                    com.itextpdf.text.pdf.PdfPCell optCell = new com.itextpdf.text.pdf.PdfPCell(new com.itextpdf.text.Phrase("  " + label++ + ". " + contentText, normalFont));
                    optCell.setBorder(com.itextpdf.text.Rectangle.NO_BORDER);
                    optionsTable.addCell(optCell);
                }
                
                int added = options.size();
                while (added % 4 != 0) {
                    com.itextpdf.text.pdf.PdfPCell emptyCell = new com.itextpdf.text.pdf.PdfPCell(new com.itextpdf.text.Phrase(""));
                    emptyCell.setBorder(com.itextpdf.text.Rectangle.NO_BORDER);
                    optionsTable.addCell(emptyCell);
                    added++;
                }
                pdfDoc.add(optionsTable);

                // --- Explanation (if any) ---
                if (q.getExplanationJson() != null && !q.getExplanationJson().isEmpty()) {
                    pdfDoc.add(new com.itextpdf.text.Paragraph("Giải thích: " + buildContentTextFromBlocks(q.getExplanationJson()), italicFont));
                }

                pdfDoc.add(new com.itextpdf.text.Paragraph("\n"));
            }
        } else {
            for (ExamQuestion eq : exam.getExamQuestions()) {
                Question q = eq.getQuestion();
                if (q == null) continue;

                // --- Question Content ---
                pdfDoc.add(new com.itextpdf.text.Paragraph("Câu " + i++ + ": " + buildContentText(q), boldFont));

                // --- Options (4 columns) ---
                com.itextpdf.text.pdf.PdfPTable optionsTable = new com.itextpdf.text.pdf.PdfPTable(4);
                optionsTable.setWidthPercentage(100);
                optionsTable.setSpacingBefore(3);
                optionsTable.setSpacingAfter(3);
                
                List<Option> options = new ArrayList<>(q.getOptions());
                options.sort(Comparator.comparing(Option::getOrderIndex));
                char label = 'A';
                for (Option opt : options) {
                    String contentText = opt.getContentJson().stream()
                            .map(block -> {
                                if ("formula".equals(block.getType()) && block.getLatex() != null) {
                                    return "$" + block.getLatex() + "$";
                                } else if ("text".equals(block.getType()) && block.getValue() != null) {
                                    return block.getValue();
                                }
                                return "";
                            })
                            .collect(Collectors.joining(" "));
                    com.itextpdf.text.pdf.PdfPCell optCell = new com.itextpdf.text.pdf.PdfPCell(new com.itextpdf.text.Phrase("  " + label++ + ". " + contentText, normalFont));
                    optCell.setBorder(com.itextpdf.text.Rectangle.NO_BORDER);
                    optionsTable.addCell(optCell);
                }
                
                int added = options.size();
                while (added % 4 != 0) {
                    com.itextpdf.text.pdf.PdfPCell emptyCell = new com.itextpdf.text.pdf.PdfPCell(new com.itextpdf.text.Phrase(""));
                    emptyCell.setBorder(com.itextpdf.text.Rectangle.NO_BORDER);
                    optionsTable.addCell(emptyCell);
                    added++;
                }
                pdfDoc.add(optionsTable);

                // --- Explanation (if any) ---
                if (q.getExplanationJson() != null && !q.getExplanationJson().isEmpty()) {
                    pdfDoc.add(new com.itextpdf.text.Paragraph("Giải thích: " + buildExplanationText(q), italicFont));
                }

                pdfDoc.add(new com.itextpdf.text.Paragraph("\n"));
            }
        }

        pdfDoc.close();
        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(out.toByteArray()));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + exam.getCode() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    private String savePdfToDisk(Exam exam) throws IOException {
        String fileName = "exported/exam_" + exam.getCode() + ".pdf";
        Files.createDirectories(Paths.get("exported"));
        try (FileOutputStream out = new FileOutputStream(fileName)) {
            com.itextpdf.text.Document pdfDoc = new com.itextpdf.text.Document();
            com.itextpdf.text.pdf.PdfWriter writer = com.itextpdf.text.pdf.PdfWriter.getInstance(pdfDoc, out);
            
            // Fonts
            com.itextpdf.text.Font titleFont = getVietnameseFont(12, com.itextpdf.text.Font.BOLD);
            com.itextpdf.text.Font normalFont = getVietnameseFont(10, com.itextpdf.text.Font.NORMAL);
            com.itextpdf.text.Font boldFont = getVietnameseFont(10, com.itextpdf.text.Font.BOLD);
            com.itextpdf.text.Font italicFont = getVietnameseFont(9, com.itextpdf.text.Font.ITALIC);
            com.itextpdf.text.Font headerFont = getVietnameseFont(8, com.itextpdf.text.Font.NORMAL);
            
            // Register page event helper
            writer.setPageEvent(new ExamPageEvent(exam.getCode(), headerFont, normalFont));
            
            pdfDoc.open();

            // 2-column header layout for page 1
            com.itextpdf.text.pdf.PdfPTable headerTable = new com.itextpdf.text.pdf.PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{45f, 55f});

            // Left Cell (School Info & Boxed Exam Code)
            com.itextpdf.text.pdf.PdfPCell leftCell = new com.itextpdf.text.pdf.PdfPCell();
            leftCell.setBorder(com.itextpdf.text.Rectangle.NO_BORDER);
            leftCell.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
            
            com.itextpdf.text.Paragraph pLeft1 = new com.itextpdf.text.Paragraph("UBND THÀNH PHỐ VŨNG TÀU", normalFont);
            pLeft1.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
            leftCell.addElement(pLeft1);
            
            com.itextpdf.text.Paragraph pLeft2 = new com.itextpdf.text.Paragraph("TRƯỜNG THCS NGUYỄN GIA THIỀU", boldFont);
            pLeft2.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
            leftCell.addElement(pLeft2);
            
            com.itextpdf.text.Paragraph pSpacer = new com.itextpdf.text.Paragraph("\n");
            pSpacer.setLeading(5);
            leftCell.addElement(pSpacer);

            com.itextpdf.text.pdf.PdfPTable boxTable = new com.itextpdf.text.pdf.PdfPTable(1);
            boxTable.setWidthPercentage(40);
            com.itextpdf.text.pdf.PdfPCell boxCell = new com.itextpdf.text.pdf.PdfPCell(new com.itextpdf.text.Phrase("Đề " + exam.getCode(), boldFont));
            boxCell.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
            boxCell.setVerticalAlignment(com.itextpdf.text.Element.ALIGN_MIDDLE);
            boxCell.setPadding(5);
            boxTable.addCell(boxCell);
            leftCell.addElement(boxTable);

            // Right Cell (Exam Title)
            com.itextpdf.text.pdf.PdfPCell rightCell = new com.itextpdf.text.pdf.PdfPCell();
            rightCell.setBorder(com.itextpdf.text.Rectangle.NO_BORDER);
            rightCell.setHorizontalAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
            
            com.itextpdf.text.Paragraph pRight1 = new com.itextpdf.text.Paragraph(exam.getName().toUpperCase(), titleFont);
            pRight1.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
            rightCell.addElement(pRight1);
            
            com.itextpdf.text.Paragraph pRight2 = new com.itextpdf.text.Paragraph("Thời gian làm bài: " + exam.getDurationMinutes() + " phút", boldFont);
            pRight2.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
            rightCell.addElement(pRight2);
            
            com.itextpdf.text.Paragraph pRight3 = new com.itextpdf.text.Paragraph("(không kể thời gian phát đề)", italicFont);
            pRight3.setAlignment(com.itextpdf.text.Element.ALIGN_CENTER);
            rightCell.addElement(pRight3);

            headerTable.addCell(leftCell);
            headerTable.addCell(rightCell);
            pdfDoc.add(headerTable);
            
            pdfDoc.add(new com.itextpdf.text.Paragraph("\n"));
            pdfDoc.add(new com.itextpdf.text.Paragraph("Phần 1: Trắc nghiệm (10 điểm) - Chọn đáp án đúng trong các đáp án sau:\n\n", boldFont));

            int i = 1;
            if (exam.getQuestionsJson() != null && !exam.getQuestionsJson().isEmpty()) {
                for (ExamQuestionSnapshotDto q : exam.getQuestionsJson()) {
                    // --- Question Content ---
                    pdfDoc.add(new com.itextpdf.text.Paragraph("Câu " + i++ + ": " + buildContentTextFromBlocks(q.getContentJson()), boldFont));

                    // --- Options (4 columns) ---
                    com.itextpdf.text.pdf.PdfPTable optionsTable = new com.itextpdf.text.pdf.PdfPTable(4);
                    optionsTable.setWidthPercentage(100);
                    optionsTable.setSpacingBefore(3);
                    optionsTable.setSpacingAfter(3);
                    
                    List<OptionDto> options = new ArrayList<>(q.getOptions() != null ? q.getOptions() : List.of());
                    options.sort(Comparator.comparing(OptionDto::getOrderIndex));
                    char label = 'A';
                    for (OptionDto opt : options) {
                        String contentText = opt.getContent() == null ? "" : opt.getContent().stream()
                                .map(block -> {
                                    if ("formula".equals(block.getType()) && block.getLatex() != null) {
                                        return "$" + block.getLatex() + "$";
                                    } else if ("text".equals(block.getType()) && block.getValue() != null) {
                                        return block.getValue();
                                    }
                                    return "";
                                })
                                .collect(Collectors.joining(" "));
                        com.itextpdf.text.pdf.PdfPCell optCell = new com.itextpdf.text.pdf.PdfPCell(new com.itextpdf.text.Phrase("  " + label++ + ". " + contentText, normalFont));
                        optCell.setBorder(com.itextpdf.text.Rectangle.NO_BORDER);
                        optionsTable.addCell(optCell);
                    }
                    
                    int added = options.size();
                    while (added % 4 != 0) {
                        com.itextpdf.text.pdf.PdfPCell emptyCell = new com.itextpdf.text.pdf.PdfPCell(new com.itextpdf.text.Phrase(""));
                        emptyCell.setBorder(com.itextpdf.text.Rectangle.NO_BORDER);
                        optionsTable.addCell(emptyCell);
                        added++;
                    }
                    pdfDoc.add(optionsTable);

                    // --- Explanation (if any) ---
                    if (q.getExplanationJson() != null && !q.getExplanationJson().isEmpty()) {
                        pdfDoc.add(new com.itextpdf.text.Paragraph("Giải thích: " + buildContentTextFromBlocks(q.getExplanationJson()), italicFont));
                    }

                    pdfDoc.add(new com.itextpdf.text.Paragraph("\n"));
                }
            } else {
                for (ExamQuestion eq : exam.getExamQuestions()) {
                    Question q = eq.getQuestion();
                    if (q == null) continue;

                    // --- Question Content ---
                    pdfDoc.add(new com.itextpdf.text.Paragraph("Câu " + i++ + ": " + buildContentText(q), boldFont));

                    // --- Options (4 columns) ---
                    com.itextpdf.text.pdf.PdfPTable optionsTable = new com.itextpdf.text.pdf.PdfPTable(4);
                    optionsTable.setWidthPercentage(100);
                    optionsTable.setSpacingBefore(3);
                    optionsTable.setSpacingAfter(3);
                    
                    List<Option> options = new ArrayList<>(q.getOptions());
                    options.sort(Comparator.comparing(Option::getOrderIndex));
                    char label = 'A';
                    for (Option opt : options) {
                        String contentText = opt.getContentJson().stream()
                                .map(block -> {
                                    if ("formula".equals(block.getType()) && block.getLatex() != null) {
                                        return "$" + block.getLatex() + "$";
                                    } else if ("text".equals(block.getType()) && block.getValue() != null) {
                                        return block.getValue();
                                    }
                                    return "";
                                })
                                .collect(Collectors.joining(" "));
                        com.itextpdf.text.pdf.PdfPCell optCell = new com.itextpdf.text.pdf.PdfPCell(new com.itextpdf.text.Phrase("  " + label++ + ". " + contentText, normalFont));
                        optCell.setBorder(com.itextpdf.text.Rectangle.NO_BORDER);
                        optionsTable.addCell(optCell);
                    }
                    
                    int added = options.size();
                    while (added % 4 != 0) {
                        com.itextpdf.text.pdf.PdfPCell emptyCell = new com.itextpdf.text.pdf.PdfPCell(new com.itextpdf.text.Phrase(""));
                        emptyCell.setBorder(com.itextpdf.text.Rectangle.NO_BORDER);
                        optionsTable.addCell(emptyCell);
                        added++;
                    }
                    pdfDoc.add(optionsTable);

                    // --- Explanation (if any) ---
                    if (q.getExplanationJson() != null && !q.getExplanationJson().isEmpty()) {
                        pdfDoc.add(new com.itextpdf.text.Paragraph("Giải thích: " + buildExplanationText(q), italicFont));
                    }

                    pdfDoc.add(new com.itextpdf.text.Paragraph("\n"));
                }
            }

            pdfDoc.close();
        } catch (com.itextpdf.text.DocumentException e) {
            throw new RuntimeException(e);
        }
        return fileName;
    }


    private String buildContentText(Question question) {
        if (question.getContentJson() == null || question.getContentJson().isEmpty()) return "";

        StringBuilder sb = new StringBuilder();
        for (ContentBlockDto block : question.getContentJson()) {
            if ("text".equals(block.getType())) {
                sb.append(block.getValue());
            } else if ("formula".equals(block.getType())) {
                sb.append(" [").append(block.getLatex()).append("] ");
            }
        }
        return sb.toString();
    }

    private String buildExplanationText(Question question) {
        if (question.getExplanationJson() == null || question.getExplanationJson().isEmpty()) return "";

        StringBuilder sb = new StringBuilder();
        for (ContentBlockDto block : question.getExplanationJson()) {
            if ("text".equals(block.getType())) {
                sb.append(block.getValue());
            } else if ("formula".equals(block.getType())) {
                sb.append(" [").append(block.getLatex()).append("] ");
            }
        }
        return sb.toString();
    }

    private String buildContentTextFromBlocks(List<ContentBlockDto> blocks) {
        if (blocks == null || blocks.isEmpty()) return "";

        StringBuilder sb = new StringBuilder();
        for (ContentBlockDto block : blocks) {
            if ("text".equals(block.getType())) {
                sb.append(block.getValue());
            } else if ("formula".equals(block.getType())) {
                sb.append(" [").append(block.getLatex()).append("] ");
            }
        }
        return sb.toString();
    }

}
