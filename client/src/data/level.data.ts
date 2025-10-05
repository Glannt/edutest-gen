import { LevelInterface } from '@/interface/level.interface';

export const initialLevels: LevelInterface[] = [
  {
    id: '1',
    name: 'Beginner',
    description: 'Người mới bắt đầu, hiểu cơ bản về hệ thống.',
    points: 100,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
    actions: '',
  },
  {
    id: '2',
    name: 'Intermediate',
    description: 'Người dùng có kinh nghiệm trung bình.',
    points: 500,
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-04-05T00:00:00Z',
    actions: '',
  },
];
