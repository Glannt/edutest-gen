import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@heroui/react';

import { GradePayload } from '@/types/grade';

interface CreateGradeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  newGrade: Partial<GradePayload>;
  handleInputChange: (
    field: keyof GradePayload,
    value: string | number
  ) => void;
  handleSubmit: () => void;
}

export function CreateGradeModal({
  isOpen,
  onOpenChange,
  newGrade,
  handleInputChange,
  handleSubmit,
}: CreateGradeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Thêm khối mới</ModalHeader>
            <ModalBody className='space-y-4'>
              <Input
                label='Tên'
                value={newGrade.name || ''}
                onValueChange={(val) => handleInputChange('name', val)}
              />
              {/* <Input
                label='Level'
                type='number'
                value={newGrade.level || 0}
                onValueChange={(val) => handleInputChange('level', Number(val))}
              /> */}
              {/* <Input
                label='Người tạo'
                value={newGrade.created_by || ''}
                onValueChange={(val) => handleInputChange('created_by', val)}
              /> */}
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
                Tạo mới
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
