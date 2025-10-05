package com.dotnt.server.service.impl;

import com.dotnt.server.dto.request.CreateExamRequest;
import com.dotnt.server.dto.request.ExamQuestionRequest;
import com.dotnt.server.dto.response.ExamQuestionResponse;
import com.dotnt.server.dto.response.ExamResponse;
import com.dotnt.server.entity.Exam;
import com.dotnt.server.entity.ExamQuestion;
import com.dotnt.server.entity.Question;
import com.dotnt.server.repository.ExamQuestionRepository;
import com.dotnt.server.repository.ExamRepository;
import com.dotnt.server.repository.MatrixRepository;
import com.dotnt.server.repository.QuestionRepository;
import com.dotnt.server.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
        }

        exam.setExamQuestions(examQuestions);
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
        exam.getExamQuestions().clear();

        List<ExamQuestionRequest> questions = request.getQuestions();
        if (request.isShuffleQuestions()) {
            Collections.shuffle(questions);
        }

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
            exam.getExamQuestions().add(examQuestion);
        }

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
                .map(exam -> {
                    List<ExamQuestionResponse> questionResponses = exam.getExamQuestions().stream()
                            .map(eq -> ExamQuestionResponse.builder()
                                    .questionId(eq.getQuestion().getId())
                                    .content(eq.getQuestion().getContent())
                                    .finalPoints(eq.getFinalPoints() != null
                                            ? eq.getFinalPoints()
                                            : eq.getQuestion().getLevel().getPoints())
                                    .build())
                            .collect(Collectors.toList());

                    return ExamResponse.builder()
                            .id(exam.getId())
                            .code(exam.getCode())
                            .name(exam.getName())
                            .startTime(exam.getStartTime())
                            .endTime(exam.getEndTime())
                            .questions(questionResponses)
                            .build();
                });
    }

    private ExamResponse mapToResponse(Exam exam) {
        List<ExamQuestionResponse> questionResponses = exam.getExamQuestions().stream()
                .map(eq -> new ExamQuestionResponse(eq.getQuestion().getId(),
                        eq.getQuestion().getContent(),
                        eq.getFinalPoints()))
                .toList();

        return ExamResponse.builder()
                .id(exam.getId())
                .code(exam.getCode())
                .name(exam.getName())
                .startTime(exam.getStartTime())
                .endTime(exam.getEndTime())
                .questions(questionResponses)
                .build();

    }
}

