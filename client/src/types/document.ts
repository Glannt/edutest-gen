export interface Document {
  id: number;
  title: string;
  type: 'document' | 'video' | 'assignment';
  updatedAt: string;
  author: string;
  downloads: number;
}
