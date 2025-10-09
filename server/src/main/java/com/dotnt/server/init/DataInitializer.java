package com.dotnt.server.init;

import com.dotnt.server.entity.*;
import com.dotnt.server.enums.UserRole;
import com.dotnt.server.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    private final LessonRepository lessonRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {

        log.info("🚀 Initializing demo data...");

        initGradeSubjects();
        initLevels();
        initQuestionTypes();
        initLessons();
        initQuestions();
        initAccount();

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
        Grade grade10 = Grade.builder().level(10).name("Grade 10").level(10).description("Khoi lop 10").created_by("system").build();
        Grade grade11 = Grade.builder().level(11).name("Grade 11").level(11).description("Khoi lop 11").created_by("system").build();
        gradeRepository.saveAll(List.of(grade10, grade11));

        // ========== 2. Create Subjects ==========
        Subject math = Subject.builder().name("Toan").description("Mon Toan hoc").build();
        Subject physics = Subject.builder().name("Vat ly").description("Mon Vat ly").build();
        subjectRepository.saveAll(List.of(math, physics));

        // ========== 3. Create Chapters ==========
        Chapter algebra = Chapter.builder().name("Dai so").description("Dai so co ban").orderIndex(1).build();
        Chapter geometry = Chapter.builder().name("Hinh hoc").description("Hinh hoc phang").orderIndex(2).build();
        Chapter mechanics = Chapter.builder().name("Co hoc").description("Luc và chuyen dong").orderIndex(1).build();
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

    // ==============================
    // NEW: INIT LESSONS
    // ==============================
    private void initLessons() {
        if (lessonRepository.count() > 0) {
            log.info("⚡ Lessons already initialized, skipping...");
            return;
        }

        List<Chapter> chapters = chapterRepository.findAll();
        if (chapters.isEmpty()) {
            log.warn("⚠ No chapters found, cannot create lessons.");
            return;
        }

        // Tạo các bài học mẫu cho mỗi chương
        chapters.forEach(chapter -> {
            Lesson l1 = Lesson.builder()
                    .chapter(chapter)
                    .name("Bai 1 - Gioi thieu " + chapter.getName())
                    .description("Bai hoc mo dau cho chuong " + chapter.getName())
                    .orderIndex(1)
                    .build();

            Lesson l2 = Lesson.builder()
                    .chapter(chapter)
                    .name("Bài 2 - Kien thuc co ban " + chapter.getName())
                    .description("Phan trong tam cua chuong " + chapter.getName())
                    .orderIndex(2)
                    .build();

            lessonRepository.saveAll(List.of(l1, l2));
            log.info("✅ Lessons created for chapter: {}", chapter.getName());
        });
    }

    // ==============================
    // QUESTIONS
    // ==============================
    private void initQuestions() {
        if (questionRepository.count() > 0) {
            log.info("⚡ Questions already initialized, skipping...");
            return;
        }

        List<Lesson> lessons = lessonRepository.findAll();
        List<Level> levels = levelRepository.findAll();
        List<QuestionType> types = questionTypeRepository.findAll();

        if (lessons.isEmpty() || levels.isEmpty() || types.isEmpty()) {
            log.warn("⚠ Missing data for questions initialization.");
            return;
        }

        Level easy = levels.get(0);
        QuestionType multipleChoice = types.stream()
                .filter(t -> t.getName().equalsIgnoreCase("TN"))
                .findFirst().orElse(types.get(0));

        lessons.forEach(lesson -> {
            Question q1 = Question.builder()
                    .lesson(lesson)
//                    .title("Câu 1: Kiến thức cơ bản về " + lesson.getName())
                    .content("Noi dung cau hoi trac nghiem dau tien cua " + lesson.getName())
                    .questionType(multipleChoice)
                    .level(easy)
//                    .createdBy("system")
                    .build();

            Question q2 = Question.builder()
                    .lesson(lesson)
//                    .title("Câu 2: Ứng dụng " + lesson.getName())
                    .content("Mot cau hoi nang cao hon ve phan kien thuc nay.")
                    .questionType(multipleChoice)
                    .level(easy)
//                    .createdBy("system")
                    .build();

            questionRepository.saveAll(List.of(q1, q2));
            log.info("✅ Questions created for lesson: {}", lesson.getName());
        });
    }

    private void initAccount() {
        if (userRepository.count() > 0) {
            log.info("⚡ Users already initialized, skipping...");
            return;
        }
        User user1 = User.builder()
                .email("do1@gmail.com")
                .username("do1")
                .password(passwordEncoder.encode("123123"))
                .role(UserRole.TEACHER)
                .createdAt(LocalDateTime.now())
                .build();
        User user2 = User.builder()
                .email("admin@gmail.com")
                .username("admin")
                .password(passwordEncoder.encode("123123"))
                .role(UserRole.ADMIN)
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.saveAll(List.of(user1, user2));
        log.info("Users created");
    }


}
