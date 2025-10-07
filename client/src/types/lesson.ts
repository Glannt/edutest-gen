import { ChapterPayload } from '@/types/chapter';

export interface LessonPayload {
  id: number;
  name: string;
  description?: string;
  orderIndex: number;
  chapterId: number;
  chapter?: ChapterPayload;
  // questions?: QuestionPayload[];
  createdAt?: string;
  updatedAt?: string;
}
