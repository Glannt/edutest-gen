import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

interface DeleteUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userName: string;
  onDelete: () => void;
}

export function DeleteUserModal({
  isOpen,
  onOpenChange,
  userName,
  onDelete,
}: DeleteUserModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <>
          <ModalHeader className='text-danger'>Xóa người dùng</ModalHeader>
          <ModalBody>
            <p>
              Bạn có chắc chắn muốn xóa người dùng <strong>{userName}</strong>?
              <br />
              Hành động này <b>không thể hoàn tác</b>.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant='flat'
              onPress={onOpenChange.bind(null, false)}
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
      </ModalContent>
    </Modal>
  );
}
