import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

interface DeleteGradeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  gradeName: string;
  onDelete: () => void;
}

export function DeleteGradeModal({
  isOpen,
  onOpenChange,
  gradeName,
  onDelete,
}: DeleteGradeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='text-danger'>Xóa Grade</ModalHeader>
            <ModalBody>
              <p>
                Bạn có chắc muốn xóa Grade <strong>{gradeName}</strong>? Hành
                động này không thể hoàn tác.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant='flat'
                onPress={onClose}
              >
                Hủy
              </Button>
              <Button
                color='danger'
                onPress={onDelete}
              >
                Xóa
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
