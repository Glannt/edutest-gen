import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

import { LevelPayload } from '@/types/level';

interface ViewLevelModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  level: LevelPayload;
}

export function ViewLevelModal({
  isOpen,
  onOpenChange,
  level,
}: ViewLevelModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Chi tiết Level</ModalHeader>
            <ModalBody>
              <p>
                <strong>Tên Level:</strong> {level.name}
              </p>
              <p>
                <strong>Mô tả:</strong> {level.description}
              </p>
              <p>
                <strong>Điểm:</strong> {level.points}
              </p>
              <p>
                <strong>Ngày tạo:</strong>{' '}
                {new Date(level.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Ngày cập nhật:</strong>{' '}
                {new Date(level.updated_at).toLocaleDateString()}
              </p>
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
