package com.dotnt.server.service.impl;

import com.dotnt.server.entity.Exam;
import com.dotnt.server.entity.ExamQuestion;
import com.dotnt.server.entity.Option;
import com.dotnt.server.repository.ExamRepository;
import com.dotnt.server.service.ExamFileService;
import com.itextpdf.text.DocumentException;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xwpf.usermodel.*;
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

        XWPFParagraph title = doc.createParagraph();
        title.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun titleRun = title.createRun();
        titleRun.setBold(true);
        titleRun.setFontSize(16);
        titleRun.setText("ĐỀ THI: " + exam.getName() + " (" + exam.getCode() + ")");

        int index = 1;
        for (ExamQuestion eq : exam.getExamQuestions()) {
            XWPFParagraph qPara = doc.createParagraph();
            XWPFRun qRun = qPara.createRun();
            qRun.setText(index++ + ". " + eq.getQuestion().getContent());

            List<Option> options = new ArrayList<>(eq.getQuestion().getOptions());
            options.sort(Comparator.comparing(Option::getOrderIndex));
            char label = 'A';
            for (Option opt : options) {
                XWPFParagraph optPara = doc.createParagraph();
                XWPFRun optRun = optPara.createRun();
                optRun.setText("   " + label++ + ". " + opt.getContent());
            }
        }
        return doc;
    }

    // ====== Export to PDF ======
    private ResponseEntity<InputStreamResource> generatePdf(Exam exam) throws IOException, DocumentException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        com.itextpdf.text.Document pdfDoc = new com.itextpdf.text.Document();
        com.itextpdf.text.pdf.PdfWriter.getInstance(pdfDoc, out);
        pdfDoc.open();

        pdfDoc.add(new com.itextpdf.text.Paragraph("ĐỀ THI: " + exam.getName() + " (" + exam.getCode() + ")\n\n"));

        int i = 1;
        for (ExamQuestion eq : exam.getExamQuestions()) {
            pdfDoc.add(new com.itextpdf.text.Paragraph(i++ + ". " + eq.getQuestion().getContent()));
            List<Option> options = new ArrayList<>(eq.getQuestion().getOptions());
            options.sort(Comparator.comparing(Option::getOrderIndex));
            char label = 'A';
            for (Option opt : options) {
                pdfDoc.add(new com.itextpdf.text.Paragraph("   " + label++ + ". " + opt.getContent()));
            }
            pdfDoc.add(new com.itextpdf.text.Paragraph("\n"));
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
            com.itextpdf.text.pdf.PdfWriter.getInstance(pdfDoc, out);
            pdfDoc.open();

            pdfDoc.add(new com.itextpdf.text.Paragraph("ĐỀ THI: " + exam.getName() + " (" + exam.getCode() + ")\n\n"));
            int i = 1;
            for (ExamQuestion eq : exam.getExamQuestions()) {
                pdfDoc.add(new com.itextpdf.text.Paragraph(i++ + ". " + eq.getQuestion().getContent()));
                List<Option> options = new ArrayList<>(eq.getQuestion().getOptions());
                options.sort(Comparator.comparing(Option::getOrderIndex));
                char label = 'A';
                for (Option opt : options) {
                    pdfDoc.add(new com.itextpdf.text.Paragraph("   " + label++ + ". " + opt.getContent()));
                }
                pdfDoc.add(new com.itextpdf.text.Paragraph("\n"));
            }

            pdfDoc.close();
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
        return fileName;
    }
}
