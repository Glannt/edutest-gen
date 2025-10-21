import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

import { QuestionTypePayload } from '@/types/question-type';

interface ViewQuestionTypeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  questionType: QuestionTypePayload;
}

export function ViewQuestionTypeModal({
  isOpen,
  onOpenChange,
  questionType,
}: ViewQuestionTypeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Chi tiết Question Type</ModalHeader>
            <ModalBody>
              <div className='space-y-2'>
                <p>
                  <strong>Tên:</strong> {questionType.name}
                </p>
                <p>
                  <strong>Mô tả:</strong> {questionType.description}
                </p>
                <p>
                  <strong>Ngày tạo:</strong>{' '}
                  {new Date(questionType.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Ngày cập nhật:</strong>{' '}
                  {new Date(questionType.updated_at).toLocaleString()}
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant='flat'
                onPress={onClose}
              >
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
