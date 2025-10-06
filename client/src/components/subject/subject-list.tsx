import { GenericCard } from '@/components/content/generic-card';
import { SubjectPayload } from '@/types/subject';

const subjects: SubjectPayload[] = [
  {
    id: 1,
    name: 'Toán học',
    description: 'Môn học về các con số và công thức.',
    created_at: '2025-01-01',
    updated_at: '2025-02-01',
  },
  {
    id: 2,
    name: 'Ngữ văn',
    description: 'Nghệ thuật ngôn từ và văn học Việt Nam.',
    created_at: '2025-01-10',
    updated_at: '2025-02-05',
  },
];

export default function SubjectList() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {subjects.map((subj) => (
        <GenericCard<SubjectPayload>
          key={subj.id}
          item={subj}
          type='subject'
        />
      ))}
    </div>
  );
}
