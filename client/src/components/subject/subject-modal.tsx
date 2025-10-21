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
      className='w-2xl h-fit'
      isOpen={isOpen}
      size='xl'
      onClose={handleModalClose}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Tạo môn học mới
            </ModalHeader>
            <ModalBody>
              <div className='space-y-4'>
                <Input
                  isRequired
                  className='mt-4 pt-2'
                  classNames={{
                    label: 'text-md mb-2',
                    inputWrapper: 'mb-2',
                  }}
                  label='Tên môn học'
                  placeholder='Nhập tên môn học'
                  value={newSubject.name}
                  onValueChange={(value) => handleInputChange('name', value)}
                />

                <Textarea
                  classNames={{
                    label: 'text-md mb-2',
                  }}
                  label='Mô tả'
                  minRows={3}
                  placeholder='Nhập mô tả môn học'
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
                Hủy
              </Button>
              <Button
                color='primary'
                onPress={handleSubmit}
              >
                Tạo môn học
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
