// src/types/matrix.ts
export interface MatrixDetailRequest {
  matrixId?: number;
  levelId: number;
  lessonId: number;
  questionTypeId: number;
  quantity: number;
}

export interface MatrixRequest {
  name: string;
  description?: string;
  totalQuestions: number;
  durationMinutes?: number;
  matrixDetails: MatrixDetailRequest[];
  userId?: number;
}

export interface MatrixDetailResponse {
  id: number;
  level: LevelDto;
  chapter_name: string;
  matrix_name: string;
  lesson: LessonDto;
  question_type_name: string;
  quantity: number;
  percent: number;
}

export interface MatrixResponse {
  id: number;
  name: string;
  description?: string;
  totalQuestions: number;
  matrixDetails: MatrixDetailResponse[];
}

export interface LessonDto {
  id: number;
  name: string;
  description?: string;
  orderIndex: number;
}

export interface LevelDto {
  id: number;
  name: string;
  description: string;
  points: number;
}
