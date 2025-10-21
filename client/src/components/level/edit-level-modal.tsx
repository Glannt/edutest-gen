import React from 'react';
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

import { LevelPayload } from '@/types/level';

interface EditLevelModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  level: LevelPayload;
  handleInputChange: (field: keyof LevelPayload, value: string) => void;
  handleSubmit: () => void;
}

export function EditLevelModal({
  isOpen,
  onOpenChange,
  level,
  handleInputChange,
  handleSubmit,
}: EditLevelModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Chỉnh sửa Level</ModalHeader>
            <ModalBody>
              <div className='space-y-4'>
                <Input
                  label='Tên Level'
                  value={level.name}
                  onValueChange={(val) => handleInputChange('name', val)}
                />
                <Textarea
                  label='Mô tả'
                  minRows={3}
                  value={level.description}
                  onValueChange={(val) => handleInputChange('description', val)}
                />
                <Input
                  label='Điểm'
                  type='number'
                  value={level.points.toString()}
                  onValueChange={(val) => handleInputChange('points', val)}
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
