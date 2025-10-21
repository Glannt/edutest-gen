import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onDelete: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

export function DeleteAccountModal({
  isOpen,
  onOpenChange,
  onDelete,
}: DeleteAccountModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1 text-danger'>
              Delete Account
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <p className='text-sm text-default-500 mt-2'>
                All your data will be permanently removed from our servers. You
                will lose all your settings, history, and saved content.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant='light'
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                color='danger'
                onPress={onDelete}
              >
                Delete Account
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
