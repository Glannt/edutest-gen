import { LevelPayload } from '@/types/level';
import { LessonPayload } from '@/types/lesson';

export interface QuestionPayload {
  id: number;
  content: string;
  explanation?: string;
  lessonId: number;
  levelId: number;
  questionTypeId: number;
  lesson?: LessonPayload;
  level?: LevelPayload;
  questionType?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
