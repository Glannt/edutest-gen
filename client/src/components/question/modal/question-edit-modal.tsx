import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
  addToast,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { QuestionPayload } from '@/types/question';
import { useUpdateQuestion } from '@/hooks/useQuestion';
import { OptionPayload } from '@/types/option';

interface QuestionEditModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  question: QuestionPayload | null;
  onSave: () => void;
}

export const QuestionEditModal: React.FC<QuestionEditModalProps> = ({
  isOpen,
  onOpenChange,
  question,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<QuestionPayload> | null>(
    null
  );
  const updateMutation = useUpdateQuestion();

  const handleChange = useCallback(
    (field: keyof QuestionPayload, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleOptionChange = useCallback(
    (optionId: number, field: keyof OptionPayload, value: any) => {
      if (!formData?.options) return;
      setFormData((prev) => ({
        ...prev!,
        options: prev!.options!.map((o) =>
          o.id === optionId ? { ...o, [field]: value } : o
        ),
      }));
    },
    [formData]
  );

  useEffect(() => {
    if (question) {
      setFormData(JSON.parse(JSON.stringify(question)));
    }
  }, [question]);

  if (!formData) return null;

  const handleSave = () => {
    if (!formData || !question) return;

    updateMutation.mutate(
      { id: question.id, payload: formData },
      {
        onSuccess: () => {
          onSave();
          onOpenChange(false);
          addToast({
            title: 'Cập nhật câu hỏi thành công',
            color: 'success',
            timeout: 2000,
          });
        },
        onError: () => {
          addToast({
            title: 'Cập nhật câu hỏi thất bại',
            color: 'danger',
            timeout: 2000,
          });
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior='inside'
      size='lg'
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Chỉnh sửa câu hỏi</ModalHeader>
            <ModalBody className='space-y-6'>
              <Input
                isRequired
                label='Nội dung câu hỏi'
                value={formData.content || ''}
                onValueChange={(value) => handleChange('content', value)}
              />
              {formData.options?.map((option, idx) => (
                <div
                  key={option.id}
                  className='flex items-center gap-3'
                >
                  <Checkbox
                    isSelected={option.isCorrect || false}
                    onValueChange={(value) =>
                      handleOptionChange(option.id!, 'isCorrect', value)
                    }
                  >
                    Đáp án đúng
                  </Checkbox>
                  <Input
                    placeholder={`Nội dung lựa chọn ${String.fromCharCode(65 + idx)}`}
                    value={option.content || ''}
                    onValueChange={(value) =>
                      handleOptionChange(option.id!, 'content', value)
                    }
                  />
                </div>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button
                color='default'
                variant='flat'
                onPress={onClose}
              >
                Hủy
              </Button>
              <Button
                color='primary'
                isLoading={updateMutation.isPending}
                startContent={
                  !updateMutation.isPending && <Icon icon='lucide:save' />
                }
                onPress={handleSave}
              >
                Lưu thay đổi
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
