import { Column } from '@/interface/column.interface';

export const INITIAL_VISIBLE_SUBJECT_COLUMNS = [
  'name',
  'description',
  'actions',
];

export const subjectColumns: Column[] = [
  { name: 'id', uid: 'id', sortable: true },
  { name: 'Tên môn học', uid: 'name', sortable: true },
  { name: 'Mô tả', uid: 'description' },
  { name: 'Ngày tạo', uid: 'created_at', sortable: true },
  { name: 'Ngày cập nhật', uid: 'updated_at', sortable: true },
  //   { name: 'LESSONS', uid: 'lessons' },
  { name: 'Thao tác', uid: 'actions' }, // thêm nếu bạn muốn có cột thao tác
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
  { uid: 'updated_at', name: 'Ngày cập nhật', sortable: true },
  { uid: 'actions', name: 'Thao tác' },
];

export const INITIAL_VISIBLE_QUESTIONTYPE_COLUMNS = [
  'name',
  'description',
  'actions',
];

export const questionTypeColumns: Column[] = [
  { uid: 'name', name: 'Tên loại câu hỏi' },
  { uid: 'description', name: 'Mô tả' },
  { uid: 'created_at', name: 'Ngày tạo' },
  { uid: 'updated_at', name: 'Cập nhật' },
  { uid: 'actions', name: 'Thao tác' },
];

export const INITIAL_VISIBLE_GRADE_COLUMNS = ['name', 'actions'];

export const gradeColumns: Column[] = [
  { uid: 'name', name: 'Khối' },
  // { uid: 'level', name: 'Cấp độ' },
  { uid: 'created_at', name: 'Ngày tạo' },
  { uid: 'updated_at', name: 'Cập nhật' },
  { uid: 'actions', name: 'Thao tác' },
];
