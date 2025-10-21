import { ContentBlockPayload } from '@/types/question';

export interface OptionPayload {
  id: number;
  content: ContentBlockPayload[];
  isCorrect: boolean;
  orderIndex: number;
  questionId?: number; // tuỳ backend có trả ra hay không
  createdAt?: string;
  updatedAt?: string;
}
