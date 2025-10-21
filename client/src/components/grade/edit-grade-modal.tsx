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

interface EditGradeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  grade: GradePayload;
  handleInputChange: (
    field: keyof GradePayload,
    value: string | number
  ) => void;
  handleSubmit: () => void;
}

export function EditGradeModal({
  isOpen,
  onOpenChange,
  grade,
  handleInputChange,
  handleSubmit,
}: EditGradeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Chỉnh sửa Grade</ModalHeader>
            <ModalBody className='space-y-4'>
              <Input
                label='Tên'
                value={grade.name}
                onValueChange={(val) => handleInputChange('name', val)}
              />
              {/* <Input
                label='Level'
                type='number'
                value={grade.level}
                onValueChange={(val) => handleInputChange('level', Number(val))}
              /> */}
              <Input
                label='Người tạo'
                value={grade.created_by}
                onValueChange={(val) => handleInputChange('created_by', val)}
              />
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
