import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

interface DeleteSubjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDelete: () => void;
  subjectName?: string;
}

export function DeleteSubjectModal({
  isOpen,
  onOpenChange,
  onDelete,
  subjectName,
}: DeleteSubjectModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='text-danger'>Xóa môn học</ModalHeader>
            <ModalBody>
              <p>
                Bạn có chắc chắn muốn xóa môn học <strong>{subjectName}</strong>
                ? Hành động này không thể hoàn tác.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant='light'
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
