import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { ExamResponse } from '../../../types/exam';

interface ExamDeleteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  exam: ExamResponse | null;
  onConfirmDelete: () => void;
}

export const ExamDeleteModal: React.FC<ExamDeleteModalProps> = ({
  isOpen,
  onOpenChange,
  exam,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!exam) return null;

  const handleDelete = () => {
    setIsDeleting(true);

    // Simulate API call
    setTimeout(() => {
      onConfirmDelete();
      setIsDeleting(false);
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      size='md'
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Xác nhận xóa
            </ModalHeader>
            <ModalBody>
              <div className='flex items-center gap-4'>
                <div className='p-3 rounded-full bg-danger-100'>
                  <Icon
                    className='text-danger text-xl'
                    icon='lucide:alert-triangle'
                  />
                </div>
                <div>
                  <p>Bạn có chắc chắn muốn xóa đề thi này?</p>
                  <p className='text-sm text-default-500 mt-1'>
                    <span className='font-semibold'>{exam.name}</span>
                    {exam.code && <span> ({exam.code})</span>}
                  </p>
                  <p className='text-sm text-danger mt-2'>
                    Hành động này không thể hoàn tác.
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color='default'
                isDisabled={isDeleting}
                variant='flat'
                onPress={onClose}
              >
                Hủy
              </Button>
              <Button
                color='danger'
                isLoading={isDeleting}
                startContent={!isDeleting && <Icon icon='lucide:trash-2' />}
                onPress={handleDelete}
              >
                Xóa đề thi
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
