export interface OptionPayload {
  id: number;
  content: string;
  isCorrect: boolean;
  orderIndex: number;
  questionId?: number; // tuỳ backend có trả ra hay không
  createdAt?: string;
  updatedAt?: string;
}
