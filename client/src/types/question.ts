import { LevelPayload } from '@/types/level';
import { LessonPayload } from '@/types/lesson';
import { QuestionTypePayload } from '@/types/question-type';
import { OptionPayload } from '@/types/option';

export interface QuestionPayload {
  id: number;
  content: string;
  explanation?: string;
  lessonId: number;
  levelId: number;
  questionTypeId: number;
  lesson?: LessonPayload;
  level?: LevelPayload;
  questionType?: QuestionTypePayload;
  options?: Partial<OptionPayload>[];
  createdAt?: string;
  updatedAt?: string;
}
