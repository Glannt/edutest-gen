import { Button } from '@heroui/button';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal';

interface RecheckModalProp {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export const RecheckModal = ({
  isOpen,
  onClose,
  onConfirm,
}: RecheckModalProp) => {
  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      //   size={size}
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Bạn có muốn tạo câu hỏi không?
            </ModalHeader>

            <ModalFooter>
              <Button
                color='primary'
                onPress={onConfirm}
              >
                Xác nhận
              </Button>
              <Button
                color='danger'
                variant='light'
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
};
