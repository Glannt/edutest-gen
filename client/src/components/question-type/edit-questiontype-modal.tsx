import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from '@heroui/react';

import { QuestionTypePayload } from '@/types/question-type';

interface EditQuestionTypeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  questionType: QuestionTypePayload;
  handleInputChange: (field: keyof QuestionTypePayload, value: string) => void;
  handleSubmit: () => void;
}

export function EditQuestionTypeModal({
  isOpen,
  onOpenChange,
  questionType,
  handleInputChange,
  handleSubmit,
}: EditQuestionTypeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Chỉnh sửa Question Type</ModalHeader>
            <ModalBody>
              <div className='space-y-4'>
                <Input
                  label='Tên'
                  value={questionType.name}
                  onValueChange={(val) => handleInputChange('name', val)}
                />
                <Textarea
                  label='Mô tả'
                  minRows={3}
                  value={questionType.description}
                  onValueChange={(val) => handleInputChange('description', val)}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant='flat'
                onPress={onClose}
              >
                Hủy
              </Button>
              <Button
                color='primary'
                onPress={handleSubmit}
              >
                Lưu thay đổi
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
