import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { ContributeModal } from '@/components/content/contribute-modal';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionSelectModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [isByLesson, setIsByLesson] = useState(false);

  const handleOpenContributeModal = (byLesson: boolean) => {
    setIsByLesson(byLesson);
    setShowContributeModal(true);
  };

  const handleCloseContributeModal = () => {
    setShowContributeModal(false);
  };

  return (
    <>
      {/* QuestionSelectModal */}
      <Modal
        isOpen={isOpen}
        scrollBehavior='inside'
        size='5xl'
        onClose={onClose}
      >
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className='flex flex-col gap-1 border-b border-divider'>
                <div className='flex items-center'>
                  <Button
                    isIconOnly
                    className='mr-2'
                    variant='light'
                    onPress={onCloseModal}
                  >
                    <Icon icon='lucide:chevron-left' />
                  </Button>
                  <span>Quay lại</span>
                </div>
              </ModalHeader>

              <ModalBody className='py-6'>
                <div className='space-y-8 flex justify-evenly'>
                  <Button
                    color='primary'
                    startContent={<Icon icon='lucide:plus' />}
                    variant='solid'
                    onPress={() => handleOpenContributeModal(false)}
                  >
                    Tạo câu hỏi theo môn học
                  </Button>

                  <Button
                    color='primary'
                    startContent={<Icon icon='lucide:plus' />}
                    variant='solid'
                    onPress={() => handleOpenContributeModal(true)}
                  >
                    Tạo câu hỏi theo bài học
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Nested ContributeModal */}
      {showContributeModal && (
        <ContributeModal
          isOpen={showContributeModal}
          showLessonSelect={isByLesson} // chỉ hiển thị nếu tạo theo bài học
          onClose={handleCloseContributeModal}
        />
      )}
    </>
  );
};
