// src/types/exam.ts
export interface ExamQuestionRequest {
  questionId: number;
  finalPoints?: number;
}

export interface CreateExamRequest {
  code?: string;
  name: string;
  matrixId: number;
  startTime?: string; // ISO string
  endTime?: string; // ISO string
  questions?: ExamQuestionRequest[];
  shuffleQuestions?: boolean;
}

export interface AutoGenerateExamRequest {
  code?: string;
  name: string;
  matrixId: number;
  numberOfQuestions: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  startTime?: string;
  endTime?: string;
}

export interface AutoGenerateExamListRequest {
  baseCode: string;
  name: string;
  matrixId: number;
  numberOfQuestions: number;
  numberOfExams: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  startTime?: string;
  endTime?: string;
}

export interface OptionDto {
  id: number;
  content: string;
  isCorrect?: boolean;
}

export interface ExamQuestionResponse {
  questionId: number;
  content: string;
  finalPoints: number;
  options: OptionDto[];
}

export interface ExamResponse {
  id: number;
  code?: string;
  name: string;
  startTime?: string;
  endTime?: string;
  questions?: ExamQuestionResponse[];
}
