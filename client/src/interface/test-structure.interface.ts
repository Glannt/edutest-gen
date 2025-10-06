export interface TestStructureItem {
  id: number;
  subject: string;
  grade: string;
  chapter: string;
  lesson: string;
  questionCount: number;
  level: 'NB' | 'TH' | 'VD';
  questionType: 'TN' | 'DS' | 'TLN';
}
