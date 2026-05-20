package com.dotnt.server.service.impl;

import com.dotnt.server.dto.ContentBlockDto;
import com.dotnt.server.dto.OptionDto;
import com.dotnt.server.dto.request.AutoGenerateExamListRequest;
import com.dotnt.server.dto.request.AutoGenerateExamRequest;
import com.dotnt.server.dto.request.CreateExamRequest;
import com.dotnt.server.dto.request.ExamQuestionRequest;
import com.dotnt.server.dto.response.ExamQuestionResponse;
import com.dotnt.server.dto.response.ExamResponse;
import com.dotnt.server.entity.*;
import com.dotnt.server.repository.ExamQuestionRepository;
import com.dotnt.server.repository.ExamRepository;
import com.dotnt.server.repository.MatrixRepository;
import com.dotnt.server.repository.QuestionRepository;
import com.dotnt.server.service.ExamService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dotnt.server.dto.ExamQuestionSnapshotDto;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final MatrixRepository matrixRepository;
    private final QuestionRepository questionRepository;
    private final ExamQuestionRepository examQuestionRepository;

    @Override
    public ExamResponse createExam(CreateExamRequest request) {
        Exam exam = Exam.builder()
                .code(request.getCode())
                .name(request.getName())
                .matrix(matrixRepository.findById(request.getMatrixId())
                        .orElseThrow(() -> new RuntimeException("Matrix not found")))
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        List<ExamQuestionRequest> questions = request.getQuestions();
        if (request.isShuffleQuestions()) {
            Collections.shuffle(questions);
        }

        Set<ExamQuestion> examQuestions = new HashSet<>();
        List<ExamQuestionSnapshotDto> snapshots = new ArrayList<>();
        for (ExamQuestionRequest qReq : questions) {
            Question question = questionRepository.findById(qReq.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found"));
            Double points = qReq.getFinalPoints() != null ? qReq.getFinalPoints() :
                    question.getLevel().getPoints(); // lấy từ level nếu null

            ExamQuestion examQuestion = ExamQuestion.builder()
                    .exam(exam)
                    .question(question)
                    .finalPoints(points)
                    .build();
            examQuestions.add(examQuestion);

            List<OptionDto> optionDtos = question.getOptions() == null ? List.of() : question.getOptions().stream()
                    .map(opt -> OptionDto.builder()
                            .id(opt.getId())
                            .content(opt.getContentJson())
                            .isCorrect(opt.getIsCorrect())
                            .orderIndex(opt.getOrderIndex())
                            .build())
                    .collect(Collectors.toList());

            snapshots.add(ExamQuestionSnapshotDto.builder()
                    .questionId(question.getId())
                    .contentJson(question.getContentJson())
                    .explanationJson(question.getExplanationJson())
                    .finalPoints(points)
                    .options(optionDtos)
                    .build());
        }

        exam.setExamQuestions(examQuestions);
        exam.setQuestionsJson(snapshots);
        examRepository.save(exam);

        return mapToResponse(exam);
    }

    @Override
    @Transactional(readOnly = true)
    public ExamResponse getExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        return mapToResponse(exam);
    }

    @Override
    public ExamResponse updateExam(Long examId, CreateExamRequest request) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        exam.setName(request.getName());
        exam.setCode(request.getCode());
        exam.setStartTime(request.getStartTime());
        exam.setEndTime(request.getEndTime());

        // Xóa examQuestion cũ
        examQuestionRepository.deleteByExamId(examId);

        List<ExamQuestionRequest> questions = request.getQuestions();
        if (request.isShuffleQuestions()) {
            Collections.shuffle(questions);
        }

        Set<ExamQuestion> examQuestions = new HashSet<>();
        List<ExamQuestionSnapshotDto> snapshots = new ArrayList<>();
        for (ExamQuestionRequest qReq : questions) {
            Question question = questionRepository.findById(qReq.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found"));
            Double points = qReq.getFinalPoints() != null ? qReq.getFinalPoints() :
                    question.getLevel().getPoints();

            ExamQuestion examQuestion = ExamQuestion.builder()
                    .exam(exam)
                    .question(question)
                    .finalPoints(points)
                    .build();
            examQuestions.add(examQuestion);

            List<OptionDto> optionDtos = question.getOptions() == null ? List.of() : question.getOptions().stream()
                    .map(opt -> OptionDto.builder()
                            .id(opt.getId())
                            .content(opt.getContentJson())
                            .isCorrect(opt.getIsCorrect())
                            .orderIndex(opt.getOrderIndex())
                            .build())
                    .collect(Collectors.toList());

            snapshots.add(ExamQuestionSnapshotDto.builder()
                    .questionId(question.getId())
                    .contentJson(question.getContentJson())
                    .explanationJson(question.getExplanationJson())
                    .finalPoints(points)
                    .options(optionDtos)
                    .build());
        }

        exam.setExamQuestions(examQuestions);
        exam.setQuestionsJson(snapshots);
        examRepository.save(exam);
        return mapToResponse(exam);
    }

    @Override
    public void deleteExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        examRepository.delete(exam);
    }

    @Override
    public Page<ExamResponse> getPaged(Pageable pageable) {
        return examRepository.findAll(pageable)
                .map(this::mapToResponse);
    }


    @Override
    @Transactional
    public ExamResponse autoGenerateExam(AutoGenerateExamRequest request) {
        // 1️⃣ Lấy matrix
        Matrix matrix = matrixRepository.findById(request.getMatrixId())
                .orElseThrow(() -> new RuntimeException("Matrix not found"));

        // 2️⃣ Lấy danh sách câu hỏi khả dụng theo matrix
        List<Question> availableQuestions = questionRepository.findByMatrixIncludeLevel(matrix);
        if (availableQuestions.isEmpty()) {
            throw new RuntimeException("No questions found for matrix");
        }

        // 3️⃣ Random chọn số lượng câu hỏi yêu cầu
        Collections.shuffle(availableQuestions);
        List<Question> selectedQuestions = availableQuestions.stream()
                .limit(request.getNumberOfQuestions())
                .collect(Collectors.toList());

        // 4️⃣ Shuffle thứ tự câu hỏi nếu bật
        if (request.isShuffleQuestions()) {
            Collections.shuffle(selectedQuestions);
        }

        // 5️⃣ Tạo exam
        Exam exam = Exam.builder()
                .code(request.getCode())
                .name(request.getName())
                .matrix(matrix)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        Set<ExamQuestion> examQuestions = new HashSet<>();
        List<ExamQuestionSnapshotDto> snapshots = new ArrayList<>();
        for (Question q : selectedQuestions) {
            ExamQuestion eq = ExamQuestion.builder()
                    .exam(exam)
                    .question(q)
                    .finalPoints(q.getLevel().getPoints())
                    .build();
            examQuestions.add(eq);

            List<OptionDto> optionDtos = q.getOptions() == null ? List.of() : q.getOptions().stream()
                    .map(opt -> OptionDto.builder()
                            .id(opt.getId())
                            .content(opt.getContentJson())
                            .isCorrect(opt.getIsCorrect())
                            .orderIndex(opt.getOrderIndex())
                            .build())
                    .collect(Collectors.toList());

            snapshots.add(ExamQuestionSnapshotDto.builder()
                    .questionId(q.getId())
                    .contentJson(q.getContentJson())
                    .explanationJson(q.getExplanationJson())
                    .finalPoints(q.getLevel().getPoints())
                    .options(optionDtos)
                    .build());
        }
        exam.setExamQuestions(examQuestions);
        exam.setQuestionsJson(snapshots);

        examRepository.save(exam);

        // 6️⃣ Map sang response và shuffle options
        return mapToResponseWithOptions(exam, request.isShuffleOptions());
    }

    @Override
    @Transactional
    public List<ExamResponse> autoGenerateExamList(AutoGenerateExamListRequest request) {
        List<ExamResponse> responses = new ArrayList<>();

        for (int i = 1; i <= request.getNumberOfExams(); i++) {
            // Sinh mã đề duy nhất
            String generatedCode = String.format("%s_%02d", request.getBaseCode(), i);

            // Dùng lại AutoGenerateExamRequest để tận dụng logic có sẵn
            AutoGenerateExamRequest singleExamReq = AutoGenerateExamRequest.builder()
                    .code(generatedCode)
                    .name(request.getName() + " - Mã " + i)
                    .matrixId(request.getMatrixId())
                    .numberOfQuestions(request.getNumberOfQuestions())
                    .shuffleQuestions(request.isShuffleQuestions())
                    .shuffleOptions(request.isShuffleOptions())
                    .startTime(request.getStartTime())
                    .endTime(request.getEndTime())
                    .build();

            // Gọi lại logic autoGenerateExam() sẵn có
            ExamResponse examResponse = autoGenerateExam(singleExamReq);
            responses.add(examResponse);
        }

        return responses;
    }

    @Override
    public Page<ExamResponse> findByMatrixId(Long matrixId, Pageable pageable) {
        Page<Exam> exams = examRepository.findByMatrix_Id(matrixId, pageable);
        return exams.map(this::mapToResponse);
    }


    private ExamResponse mapToResponseWithOptions(Exam exam, boolean shuffleOptions) {
        List<ExamQuestionResponse> questionResponses;
        if (exam.getQuestionsJson() != null && !exam.getQuestionsJson().isEmpty()) {
            questionResponses = exam.getQuestionsJson().stream()
                    .map(snapshot -> {
                        List<OptionDto> options = snapshot.getOptions() == null ? new ArrayList<>() : new ArrayList<>(snapshot.getOptions());
                        if (shuffleOptions) {
                            Collections.shuffle(options);
                        }
                        return ExamQuestionResponse.builder()
                                .questionId(snapshot.getQuestionId())
                                .finalPoints(snapshot.getFinalPoints())
                                .content(buildContentTextFromBlocks(snapshot.getContentJson()))
                                .options(options)
                                .build();
                    })
                    .collect(Collectors.toList());
        } else {
            questionResponses = exam.getExamQuestions().stream()
                    .map(eq -> {
                        Question q = eq.getQuestion();
                        if (q == null) return null;
                        List<Option> options = new ArrayList<>(q.getOptions());
                        if (shuffleOptions) {
                            Collections.shuffle(options);
                        }

                        List<OptionDto> optionDtos = options.stream()
                                .map(opt -> OptionDto.builder()
                                        .id(opt.getId())
                                        .content(opt.getContentJson())
                                        .isCorrect(opt.getIsCorrect())
                                        .orderIndex(opt.getOrderIndex())
                                        .build())
                                .collect(Collectors.toList());

                        return ExamQuestionResponse.builder()
                                .questionId(q.getId())
                                .content(buildContentText(q))
                                .finalPoints(eq.getFinalPoints() != null ? eq.getFinalPoints() : (q.getLevel() != null ? q.getLevel().getPoints() : 0.0))
                                .options(optionDtos)
                                .build();
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }

        return ExamResponse.builder()
                .code(exam.getCode())
                .name(exam.getName())
                .startTime(exam.getStartTime())
                .endTime(exam.getEndTime())
                .questions(questionResponses)
                .build();
    }

    private ExamResponse mapToResponse(Exam exam) {
        List<ExamQuestionResponse> questionResponses;
        if (exam.getQuestionsJson() != null && !exam.getQuestionsJson().isEmpty()) {
            questionResponses = exam.getQuestionsJson().stream()
                    .map(snapshot -> ExamQuestionResponse.builder()
                            .questionId(snapshot.getQuestionId())
                            .finalPoints(snapshot.getFinalPoints())
                            .content(buildContentTextFromBlocks(snapshot.getContentJson()))
                            .options(snapshot.getOptions())
                            .build())
                    .collect(Collectors.toList());
        } else {
            // Fallback for older data that doesn't have questionsJson yet
            questionResponses = exam.getExamQuestions().stream()
                    .map(eq -> {
                        Question q = eq.getQuestion();
                        if (q == null) return null;
                        List<OptionDto> optionDtos = q.getOptions() == null ? List.of() : q.getOptions().stream()
                                .map(opt -> OptionDto.builder()
                                        .id(opt.getId())
                                        .content(opt.getContentJson())
                                        .isCorrect(opt.getIsCorrect())
                                        .orderIndex(opt.getOrderIndex())
                                        .build())
                                .collect(Collectors.toList());
                        return ExamQuestionResponse.builder()
                                .questionId(q.getId())
                                .finalPoints(eq.getFinalPoints() != null ? eq.getFinalPoints() : (q.getLevel() != null ? q.getLevel().getPoints() : 0.0))
                                .content(buildContentText(q))
                                .options(optionDtos)
                                .build();
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }

        return ExamResponse.builder()
                .id(exam.getId())
                .code(exam.getCode())
                .name(exam.getName())
                .startTime(exam.getStartTime())
                .endTime(exam.getEndTime())
                .questions(questionResponses)
                .build();
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

