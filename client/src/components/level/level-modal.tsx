import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from '@heroui/react';

import { LevelInterface } from '@/interface/level.interface';

interface LevelModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handleInputChange: (field: string, value: string) => void;
  handleModalClose: () => void;
  handleSubmit: () => void;
  newLevel: Partial<LevelInterface>;
}

export default function LevelModal({
  isOpen,
  onOpenChange,
  handleInputChange,
  handleModalClose,
  handleSubmit,
  newLevel,
}: LevelModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Thêm cấp độ mới</ModalHeader>
            <ModalBody>
              <Input
                label='Tên cấp độ'
                value={newLevel.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <Input
                label='Mô tả'
                value={newLevel.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
              />
              <Input
                label='Điểm'
                type='number'
                value={newLevel.points?.toString() || ''}
                onChange={(e) => handleInputChange('points', e.target.value)}
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
