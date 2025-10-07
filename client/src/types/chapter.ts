import { LessonPayload } from '@/types/lesson';

export interface ChapterPayload {
  id: number;
  name: string;
  description?: string;
  orderIndex: number;
  lessons?: LessonPayload[]; // quan hệ OneToMany từ entity
  createdAt?: string;
  updatedAt?: string;
}
