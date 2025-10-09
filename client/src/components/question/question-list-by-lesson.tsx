import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@heroui/react';

import { QuestionItem } from '@/components/question/question-item';
import { QuestionEditModal } from '@/components/question/modal/question-edit-modal';
import { QuestionDeleteModal } from '@/components/question/modal/question-delete-modal';
import { useQuestionsByLesson } from '@/hooks/useQuestion';
import { QuestionPayload } from '@/types/question';

export const QuestionListByLesson: React.FC = () => {
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

  return (
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
  );
};
