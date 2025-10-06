import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from '@heroui/react';

import { QuestionTypePayload } from '@/types/question-type';

interface QuestionTypeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handleInputChange: (field: string, value: string) => void;
  handleModalClose: () => void;
  handleSubmit: () => void;
  newQuestionType: Partial<QuestionTypePayload>;
}

export default function QuestionTypeModal({
  isOpen,
  onOpenChange,
  handleInputChange,
  handleModalClose,
  handleSubmit,
  newQuestionType,
}: QuestionTypeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Thêm loại câu hỏi mới</ModalHeader>
            <ModalBody>
              <Input
                label='Tên loại câu hỏi'
                value={newQuestionType.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <Input
                label='Mô tả'
                value={newQuestionType.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant='flat'
                onPress={handleModalClose}
              >
                Hủy
              </Button>
              <Button
                color='primary'
                onPress={handleSubmit}
              >
                Lưu
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
