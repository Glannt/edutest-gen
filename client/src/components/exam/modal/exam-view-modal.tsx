import React, { useMemo } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Accordion,
  AccordionItem,
  Divider,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { ExamResponse } from '../../../types/exam';

interface ExamViewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  exam: ExamResponse | null;
}

export const ExamViewModal: React.FC<ExamViewModalProps> = ({
  isOpen,
  onOpenChange,
  exam,
}) => {
  // Calculate total points
  const totalPoints = useMemo(() => {
    if (!exam?.questions || exam.questions.length === 0) return 0;

    return exam.questions.reduce((sum, q) => sum + q.finalPoints, 0);
  }, [exam?.questions]);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Không giới hạn';

    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (!exam) return null;

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior='inside'
      size='3xl'
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              <div className='flex items-center gap-2'>
                <span>Chi tiết đề thi</span>
                <Chip
                  color='primary'
                  size='sm'
                  variant='flat'
                >
                  {exam.code || `#${exam.id}`}
                </Chip>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className='space-y-6'>
                {/* Exam details */}
                <div className='space-y-4'>
                  <h3 className='text-xl font-semibold'>{exam.name}</h3>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-1'>
                      <p className='text-sm text-default-500'>
                        Thời gian bắt đầu
                      </p>
                      <p className='font-medium'>
                        {formatDate(exam.startTime)}
                      </p>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm text-default-500'>
                        Thời gian kết thúc
                      </p>
                      <p className='font-medium'>{formatDate(exam.endTime)}</p>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='space-y-1'>
                      <p className='text-sm text-default-500'>
                        Tổng số câu hỏi
                      </p>
                      <p className='font-medium'>
                        {exam.questions?.length || 0} câu hỏi
                      </p>
                    </div>
                    <div className='space-y-1 text-right'>
                      <p className='text-sm text-default-500'>Tổng điểm</p>
                      <p className='font-medium'>{totalPoints} điểm</p>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Questions */}
                <div className='space-y-4'>
                  <h4 className='text-lg font-medium'>Danh sách câu hỏi</h4>

                  {!exam.questions || exam.questions.length === 0 ? (
                    <div className='text-center py-4 text-default-400'>
                      Không có câu hỏi nào trong đề thi này
                    </div>
                  ) : (
                    <Accordion
                      selectionMode='multiple'
                      variant='splitted'
                    >
                      {(exam.questions ?? []).map((question, index) => (
                        <AccordionItem
                          key={question.questionId}
                          title={
                            <div className='flex items-center justify-between w-full pr-2'>
                              <div className='flex-1 truncate'>
                                <span className='font-medium'>
                                  Câu {index + 1}:{' '}
                                </span>
                                {question.content}
                              </div>
                              <Chip
                                className='ml-2'
                                color='primary'
                                size='sm'
                                variant='flat'
                              >
                                {question.finalPoints} điểm
                              </Chip>
                            </div>
                          }
                        >
                          <div className='space-y-3 px-2'>
                            <p className='font-medium'>Các lựa chọn:</p>
                            <div className='space-y-2'>
                              {(question.options ?? []).map((option) => (
                                <div
                                  key={option.id}
                                  className={`p-3 rounded-md border ${
                                    option.isCorrect
                                      ? 'border-success bg-success-50'
                                      : 'border-default-200'
                                  }`}
                                >
                                  <div className='flex items-center gap-2'>
                                    {option.isCorrect && (
                                      <Icon
                                        className='text-success text-lg'
                                        icon='lucide:check-circle'
                                      />
                                    )}
                                    <span>{option.content}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color='primary'
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
