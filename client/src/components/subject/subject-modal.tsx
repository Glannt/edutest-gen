import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';

interface SubjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  newSubject: {
    name: string;
    description: string;
  };
  handleInputChange: (field: string, value: string) => void;
  handleSubmit: () => void;
  handleModalClose: () => void;
}
export default function SubjectModal({
  isOpen,
  onOpenChange,
  newSubject,
  handleInputChange,
  handleSubmit,
  handleModalClose,
}: SubjectModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Create New Subject
            </ModalHeader>
            <ModalBody>
              <div className='space-y-4'>
                <Input
                  isRequired
                  label='Name'
                  placeholder='Enter subject name'
                  value={newSubject.name}
                  onValueChange={(value) => handleInputChange('name', value)}
                />

                <Textarea
                  label='Description'
                  minRows={3}
                  placeholder='Enter subject description'
                  value={newSubject.description}
                  onValueChange={(value) =>
                    handleInputChange('description', value)
                  }
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant='flat'
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                color='primary'
                onPress={handleSubmit}
              >
                Create Subject
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
