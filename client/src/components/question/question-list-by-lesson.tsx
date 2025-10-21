import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';

import { QuestionItem } from '@/components/question/question-item';
import { QuestionEditModal } from '@/components/question/modal/question-edit-modal';
import { QuestionDeleteModal } from '@/components/question/modal/question-delete-modal';
import { useQuestionsByLesson } from '@/hooks/useQuestion';
import { QuestionPayload } from '@/types/question';

export const QuestionListByLesson: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingQuestion, setEditingQuestion] =
    useState<QuestionPayload | null>(null);
  const [deletingQuestion, setDeletingQuestion] =
    useState<QuestionPayload | null>(null);

  const {
    data: questions,
    isLoading,
    error,
  } = useQuestionsByLesson(Number(lessonId));

  const handleSelect = (id: number, isSelected: boolean) => {
    setSelectedIds((prev) =>
      isSelected ? [...prev, id] : prev.filter((itemId) => itemId !== id)
    );
  };

  if (isLoading) return <Spinner label='Đang tải câu hỏi...' />;
  if (error) return <div className='text-danger-500'>Lỗi khi tải câu hỏi</div>;
  if (!questions?.length)
    return (
      <div className='text-default-500'>
        Không có câu hỏi nào trong bài học này.
      </div>
    );
  const handleBack = () => {
    navigate(`/dashboard/lesson/`);
  };

  return (
    <>
      <div className='flex justify-end mb-5 text '>
        <Button
          className='font-bold text-xl text-center'
          startContent={<Icon icon='lucide:chevron-left' />}
          variant='light'
          onPress={handleBack}
        >
          Quay lại
        </Button>
      </div>

      <div className='space-y-6'>
        {questions.map((q) => (
          <QuestionItem
            key={q.id}
            isSelected={selectedIds.includes(q.id)}
            question={q}
            onDelete={() => setDeletingQuestion(q)}
            onEdit={() => setEditingQuestion(q)}
            onSelect={(isSelected) => handleSelect(q.id, isSelected)}
          />
        ))}

        {/* Modal Edit */}
        {editingQuestion && (
          <QuestionEditModal
            isOpen={!!editingQuestion}
            lessonId={Number(lessonId)}
            question={editingQuestion}
            onOpenChange={(open) => !open && setEditingQuestion(null)}
            onSave={() => setEditingQuestion(null)}
          />
        )}

        {/* Modal Delete */}
        {deletingQuestion && (
          <QuestionDeleteModal
            isOpen={!!deletingQuestion}
            question={deletingQuestion}
            onOpenChange={(open) => !open && setDeletingQuestion(null)}
          />
        )}
      </div>
    </>
  );
};
