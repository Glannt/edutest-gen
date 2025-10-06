export interface TableDataMatrix {
  chapter: string;
  content: string;
  isSubRow?: boolean;
  rowSpan?: number;
  totalScore?: number;

  // Key dynamic cho level_questionType và subject
  [key: string]: string | number | boolean | undefined;
}
