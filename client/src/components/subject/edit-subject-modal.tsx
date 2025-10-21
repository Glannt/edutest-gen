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

import { SubjectPayload } from '@/types/subject';

interface EditSubjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  subject: SubjectPayload;
  handleInputChange: (field: keyof SubjectPayload, value: string) => void;
  handleSubmit: () => void;
}

export function EditSubjectModal({
  isOpen,
  onOpenChange,
  subject,
  handleInputChange,
  handleSubmit,
}: EditSubjectModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Chỉnh sửa môn học</ModalHeader>
            <ModalBody>
              <div className='space-y-4'>
                <Input
                  label='Tên môn học'
                  value={subject.name}
                  onValueChange={(val) => handleInputChange('name', val)}
                />
                <Textarea
                  label='Mô tả'
                  minRows={3}
                  value={subject.description}
                  onValueChange={(val) => handleInputChange('description', val)}
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
