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

export const INITIAL_VISIBLE_LEVEL_COLUMNS = [
  'name',
  'description',
  'points',
  'actions',
];

export const levelColumns: Column[] = [
  { uid: 'name', name: 'Tên cấp độ', sortable: true },
  { uid: 'description', name: 'Mô tả' },
  { uid: 'points', name: 'Điểm', sortable: true },
  { uid: 'created_at', name: 'Ngày tạo', sortable: true },
  { uid: 'updated_at', name: 'Cập nhật', sortable: true },
  { uid: 'actions', name: 'Hành động' },
];

export const INITIAL_VISIBLE_QUESTIONTYPE_COLUMNS = [
  'name',
  'description',
  'actions',
];

export const questionTypeColumns = [
  { key: 'name', label: 'Tên loại câu hỏi' },
  { key: 'description', label: 'Mô tả' },
  { key: 'created_at', label: 'Ngày tạo' },
  { key: 'updated_at', label: 'Cập nhật' },
  { key: 'actions', label: 'Thao tác' },
];
