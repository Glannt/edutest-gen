import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

import { UserPayload } from '@/types/user';

interface ViewUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: UserPayload;
}

export function ViewUserModal({
  isOpen,
  onOpenChange,
  user,
}: ViewUserModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <>
          <ModalHeader>Chi tiết người dùng</ModalHeader>
          <ModalBody>
            <p>
              <strong>Họ tên:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Vai trò:</strong> {user.role}
            </p>
            <p>
              <strong>Trạng thái:</strong>{' '}
              {user.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Ngày cập nhật:</strong>{' '}
              {new Date(user.updatedAt).toLocaleDateString()}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant='flat'
              onPress={onOpenChange.bind(null, false)}
            >
              Đóng
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
