import { Column } from '@/interface/column.interface';

export const INITIAL_VISIBLE_SUBJECT_COLUMNS = [
  'name',
  'description',
  'actions',
];

export const subjectColumns: Column[] = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'DESCRIPTION', uid: 'description' },
  { name: 'CREATED AT', uid: 'created_at', sortable: true },
  { name: 'UPDATED AT', uid: 'updated_at', sortable: true },
  //   { name: 'LESSONS', uid: 'lessons' },
  { name: 'ACTIONS', uid: 'actions' }, // thêm nếu bạn muốn có cột thao tác
];
