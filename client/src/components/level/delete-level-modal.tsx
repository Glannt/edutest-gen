import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

interface DeleteLevelModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  levelName: string;
  onDelete: () => void;
}

export function DeleteLevelModal({
  isOpen,
  onOpenChange,
  levelName,
  onDelete,
}: DeleteLevelModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='text-danger'>Xóa Level</ModalHeader>
            <ModalBody>
              <p>
                Bạn có chắc muốn xóa Level `&quot;`<strong>{levelName}</strong>
                ?`&quot;` Hành động này không thể hoàn tác.
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
                Xóa Level
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
