import React from 'react';
import { useSearchParams } from 'react-router-dom';

import CreateQuestionForm from '@/components/question/create-question-form';

export default function CreateQuestionPage() {
  const [params] = useSearchParams();

  const gradeId = Number(params.get('gradeId'));
  const subjectId = Number(params.get('subjectId'));
  const chapterId = Number(params.get('chapterId'));
  const lessonId = Number(params.get('lessonId'));

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Tạo câu hỏi mới</h1>
      <CreateQuestionForm
        selectedChapter={chapterId}
        selectedGrade={gradeId}
        selectedLesson={lessonId}
        selectedSubject={subjectId}
      />
    </div>
  );
}
