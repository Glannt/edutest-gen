import React, { useState, useCallback } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { QuestionPayload } from '@/types/question';
import { useDeleteQuestion } from '@/hooks/useQuestion';

interface QuestionDeleteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  question: QuestionPayload | null;
}

export const QuestionDeleteModal: React.FC<QuestionDeleteModalProps> = ({
  isOpen,
  onOpenChange,
  question,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMutation = useDeleteQuestion();
  const handleDelete = useCallback(() => {
    if (!question) return; // đảm bảo question không null

    setIsDeleting(true);
    deleteMutation.mutate(question.id, {
      onSuccess: () => {
        setIsDeleting(false);
        onOpenChange(false);
      },
      onError: () => setIsDeleting(false),
    });
  }, [deleteMutation, question, onOpenChange]);

  if (!question) return null;

  return (
    <Modal
      isOpen={isOpen}
      size='md'
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Xác nhận xóa
            </ModalHeader>
            <ModalBody>
              <div className='flex items-center gap-4'>
                <div className='p-3 rounded-full bg-danger-100'>
                  <Icon
                    className='text-danger text-xl'
                    icon='lucide:alert-triangle'
                  />
                </div>
                <div>
                  <p>Bạn có chắc chắn muốn xóa câu hỏi này?</p>
                  <p className='text-sm text-default-500 mt-1'>
                    <span className='font-semibold'>{question.content}</span>
                  </p>
                  <p className='text-sm text-danger mt-2'>
                    Hành động này không thể hoàn tác.
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color='default'
                isDisabled={isDeleting}
                variant='flat'
                onPress={onClose}
              >
                Hủy
              </Button>
              <Button
                color='danger'
                isLoading={isDeleting}
                startContent={!isDeleting && <Icon icon='lucide:trash-2' />}
                onPress={handleDelete}
              >
                Xóa câu hỏi
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
