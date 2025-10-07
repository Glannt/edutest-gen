package com.dotnt.server.init;

import com.dotnt.server.entity.*;
import com.dotnt.server.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final GradeRepository gradeRepository;
    private final SubjectRepository subjectRepository;
    private final ChapterRepository chapterRepository;
    private final GradeSubjectRepository gradeSubjectRepository;
    private final GradeSubjectChapterRepository gradeSubjectChapterRepository;
    private final LevelRepository levelRepository;
    private final QuestionTypeRepository questionTypeRepository;

    @Override
    @Transactional
    public void run(String... args) {

        log.info("🚀 Initializing demo data...");

        initGradeSubjects();
        initLevels();
        initQuestionTypes();

        log.info("✅ Demo data initialized successfully!");
    }

    private void initLevels() {
        if (levelRepository.count() > 0) {
            log.info("⚡ Data already initialized, skipping...");
            return;
        }
        Level easy = Level.builder()
                .name("NH")
                .description("Nhan biet")
                .points(1.0)
                .build();

        Level medium = Level.builder()
                .name("TH")
                .description("Thong hieu")
                .points(2.0)
                .build();

        Level hard = Level.builder()
                .name("VD")
                .description("Van dung")
                .points(3.0)
                .build();

        levelRepository.saveAll(List.of(easy, medium, hard));
        log.info("✅ Levels saved: NH, TH, VD");
    }

    private void initQuestionTypes() {

        if (questionTypeRepository.count() > 0) {
            log.info("⚡ Data already initialized, skipping...");
            return;
        }

        QuestionType multipleChoice = QuestionType.builder()
                .name("TN")
                .description("Cau hoi trac nghiem")
                .build();

        QuestionType essay = QuestionType.builder()
                .name("TLN")
                .description("Cau hoi tu luan")
                .build();

        QuestionType trueFalse = QuestionType.builder()
                .name("D/S")
                .description("Cau hoi dung hoac sai")
                .build();

        questionTypeRepository.saveAll(List.of(multipleChoice, essay, trueFalse));
        log.info("✅ QuestionTypes saved: TN, TLN, D/S");
    }

    private void initGradeSubjects() {
        if (gradeRepository.count() > 0) {
            log.info("⚡ Data already initialized, skipping...");
            return;
        }
        // ========== 1. Create Grades ==========
        Grade grade10 = Grade.builder().name("Grade 10").level(10).description("Khoi lop 10").created_by("system").build();
        Grade grade11 = Grade.builder().name("Grade 11").level(11).description("Khoi lop 11").created_by("system").build();
        gradeRepository.saveAll(List.of(grade10, grade11));

        // ========== 2. Create Subjects ==========
        Subject math = Subject.builder().name("Toan").description("Mon Toan hoc").build();
        Subject physics = Subject.builder().name("Vat ly").description("Mon Vat ly").build();
        subjectRepository.saveAll(List.of(math, physics));

        // ========== 3. Create Chapters ==========
        Chapter algebra = Chapter.builder().name("Dai so").description("Dai so co ban").orderIndex(1).build();
        Chapter geometry = Chapter.builder().name("Hinh hoc").description("Hinh hoc phang").orderIndex(2).build();
        Chapter mechanics = Chapter.builder().name("Co hoc").description("Luc và chuyen đong").orderIndex(1).build();
        Chapter optics = Chapter.builder().name("Quang hoc").description("Anh sang và song").orderIndex(2).build();

        chapterRepository.saveAll(List.of(algebra, geometry, mechanics, optics));

        // ========== 4. Create GradeSubject relations ==========
        GradeSubject grade10Math = GradeSubject.builder()
                .grade(grade10)
                .subject(math)
                .build();

        GradeSubject grade11Math = GradeSubject.builder()
                .grade(grade11)
                .subject(math)
                .build();

        GradeSubject grade10Physics = GradeSubject.builder()
                .grade(grade10)
                .subject(physics)
                .build();

        gradeSubjectRepository.saveAll(List.of(grade10Math, grade11Math, grade10Physics));

        // ========== 5. Create GradeSubjectChapter relations ==========
        // Toán 10 → Đại số, Hình học
        GradeSubjectChapter gsc1 = GradeSubjectChapter.builder()
                .gradeSubject(grade10Math)
                .chapter(algebra)
                .orderIndex(1)
                .build();
        GradeSubjectChapter gsc2 = GradeSubjectChapter.builder()
                .gradeSubject(grade10Math)
                .chapter(geometry)
                .orderIndex(2)
                .build();

        // Toán 11 → Đại số
        GradeSubjectChapter gsc3 = GradeSubjectChapter.builder()
                .gradeSubject(grade11Math)
                .chapter(algebra)
                .orderIndex(1)
                .build();

        // Vật lý 10 → Cơ học, Quang học
        GradeSubjectChapter gsc4 = GradeSubjectChapter.builder()
                .gradeSubject(grade10Physics)
                .chapter(mechanics)
                .orderIndex(1)
                .build();
        GradeSubjectChapter gsc5 = GradeSubjectChapter.builder()
                .gradeSubject(grade10Physics)
                .chapter(optics)
                .orderIndex(2)
                .build();

        gradeSubjectChapterRepository.saveAll(List.of(gsc1, gsc2, gsc3, gsc4, gsc5));
    }


}
