import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

import { GradePayload } from '@/types/grade';

interface ViewGradeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  grade: GradePayload;
}

export function ViewGradeModal({
  isOpen,
  onOpenChange,
  grade,
}: ViewGradeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Chi tiết Grade</ModalHeader>
            <ModalBody className='space-y-2'>
              <p>
                <strong>Tên:</strong> {grade.name}
              </p>
              <p>
                <strong>Level:</strong> {grade.level}
              </p>
              <p>
                <strong>Người tạo:</strong> {grade.created_by}
              </p>
              <p>
                <strong>Ngày tạo:</strong>{' '}
                {new Date(grade.created_at ?? '').toLocaleString()}
              </p>
              <p>
                <strong>Ngày cập nhật:</strong>{' '}
                {new Date(grade.updated_at ?? '').toLocaleString()}
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
