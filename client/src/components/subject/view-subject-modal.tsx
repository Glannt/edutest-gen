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

interface ViewSubjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  subject: SubjectPayload;
}

export function ViewSubjectModal({
  isOpen,
  onOpenChange,
  subject,
}: ViewSubjectModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Thông tin môn học</ModalHeader>
            <ModalBody>
              <div className='space-y-4'>
                <Input
                  readOnly
                  label='Tên môn học'
                  value={subject.name}
                />
                <Textarea
                  readOnly
                  label='Mô tả'
                  minRows={3}
                  value={subject.description}
                />
              </div>
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
