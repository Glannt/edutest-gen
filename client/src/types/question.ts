import { LevelPayload } from '@/types/level';
import { LessonPayload } from '@/types/lesson';
import { QuestionTypePayload } from '@/types/question-type';
import { OptionPayload } from '@/types/option';

export interface QuestionPayload {
  id: number;
  contentJson: ContentBlockPayload[]; // thay cho content string
  explanationJson?: ContentBlockPayload[]; // thay cho explanation string
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

export interface ContentBlockPayload {
  type: 'text' | 'formula';
  value?: string; // chỉ dùng khi type=text
  latex?: string; // chỉ dùng khi type=formula
  ast?: any; // JSON AST, chỉ dùng khi type=formula
}
