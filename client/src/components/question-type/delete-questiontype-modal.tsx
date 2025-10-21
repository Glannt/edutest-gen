import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

interface DeleteQuestionTypeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  questionTypeName: string;
  onDelete: () => void;
}

export function DeleteQuestionTypeModal({
  isOpen,
  onOpenChange,
  questionTypeName,
  onDelete,
}: DeleteQuestionTypeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='text-danger'>Xóa Question Type</ModalHeader>
            <ModalBody>
              <p>
                Bạn có chắc muốn xóa Question Type{' '}
                <strong>{questionTypeName}</strong>? Hành động này không thể
                hoàn tác.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant='flat'
                onPress={onClose}
              >
                Hủy
              </Button>
              <Button
                color='danger'
                onPress={onDelete}
              >
                Xóa
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
