import { SubjectInterface } from '@/interface/subject.interface';

export const initialSubjects: SubjectInterface[] = [
  {
    id: '1',
    name: 'Mathematics',
    description: 'Study of numbers, quantities, and shapes',
    created_at: '2023-10-15T10:30:00Z',
    updated_at: '2023-10-15T10:30:00Z',
    lessons: [1, 3],
  },
  {
    id: '2',
    name: 'Physics',
    description: 'Study of matter, energy, and the interaction between them',
    created_at: '2023-10-16T09:15:00Z',
    updated_at: '2023-10-16T09:15:00Z',
    lessons: [2],
  },
  {
    id: '3',
    name: 'Computer Science',
    description: 'Study of computers and computational systems',
    created_at: '2023-10-17T14:45:00Z',
    updated_at: '2023-10-17T14:45:00Z',
    lessons: [4, 5],
  },
  {
    id: '4',
    name: 'Biology',
    description: 'Study of living organisms and their interactions',
    created_at: '2023-10-18T11:20:00Z',
    updated_at: '2023-10-18T11:20:00Z',
    lessons: [1, 2, 3],
  },
  {
    id: '5',
    name: 'Chemistry',
    description: 'Study of substances, their properties, and reactions',
    created_at: '2023-10-19T13:10:00Z',
    updated_at: '2023-10-19T13:10:00Z',
    lessons: [],
  },
  {
    id: '6',
    name: 'History',
    description: 'Study of past events and human affairs',
    created_at: '2023-10-20T08:50:00Z',
    updated_at: '2023-10-20T08:50:00Z',
    lessons: [3, 5],
  },
  {
    id: '7',
    name: 'Geography',
    description:
      'Study of places and the relationships between people and their environments',
    created_at: '2023-10-21T15:30:00Z',
    updated_at: '2023-10-21T15:30:00Z',
    lessons: [2, 4],
  },
  {
    id: '8',
    name: 'Literature',
    description:
      'Study of written works, especially those considered of superior or lasting artistic merit',
    created_at: '2023-10-22T10:00:00Z',
    updated_at: '2023-10-22T10:00:00Z',
    lessons: [1],
  },
  {
    id: '9',
    name: 'Art',
    description:
      'Expression or application of human creative skill and imagination',
    created_at: '2023-10-23T12:40:00Z',
    updated_at: '2023-10-23T12:40:00Z',
    lessons: [5],
  },
  {
    id: '10',
    name: 'Music',
    description: 'Art of arranging sounds in time to produce a composition',
    created_at: '2023-10-24T09:25:00Z',
    updated_at: '2023-10-24T09:25:00Z',
    lessons: [3, 4],
  },
];
