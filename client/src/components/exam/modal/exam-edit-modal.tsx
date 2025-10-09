import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Accordion,
  AccordionItem,
  Divider,
  Checkbox,
  addToast,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import {
  ExamResponse,
  ExamQuestionResponse,
  OptionDto,
  CreateExamRequest,
} from '../../../types/exam';
import { ExamDateRangePicker } from '../exam-date-range-picker';

import { useUpdateExam } from '@/hooks/useExam';

interface ExamEditModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  exam: ExamResponse | null;
  onSave: () => void; // trigger refetch outside
}

export const ExamEditModal: React.FC<ExamEditModalProps> = ({
  isOpen,
  onOpenChange,
  exam,
  onSave,
}) => {
  const [formData, setFormData] = useState<ExamResponse | null>(null);
  const [isShuffleQuestion, setIsShuffleQuestion] = useState(false);

  const updateMutation = useUpdateExam();

  // Initialize form data when exam changes
  React.useEffect(() => {
    if (exam) {
      setFormData(JSON.parse(JSON.stringify(exam))); // deep clone
    }
  }, [exam]);

  if (!formData) return null;

  // Handle input change
  const handleInputChange = (field: keyof ExamResponse, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle date range change
  const handleDateRangeChange = (startTime?: string, endTime?: string) => {
    setFormData({ ...formData, startTime, endTime });
  };

  // Handle question change
  const handleQuestionChange = (
    questionId: number,
    field: keyof ExamQuestionResponse,
    value: any
  ) => {
    if (!formData.questions) return;

    setFormData({
      ...formData,
      questions: formData.questions.map((q) =>
        q.questionId === questionId ? { ...q, [field]: value } : q
      ),
    });
  };

  // Handle option change
  const handleOptionChange = (
    questionId: number,
    optionId: number,
    field: keyof OptionDto,
    value: any
  ) => {
    if (!formData.questions) return;

    setFormData({
      ...formData,
      questions: formData.questions.map((q) => {
        if (q.questionId !== questionId) return q;

        return {
          ...q,
          options: q.options.map((o) =>
            o.id === optionId ? { ...o, [field]: value } : o
          ),
        };
      }),
    });
  };

  // Handle save using mutation
  const handleSave = () => {
    if (!formData) return;

    // Chuyển formData (ExamResponse) sang CreateExamRequest
    const payload: CreateExamRequest = {
      code: formData.code,
      name: formData.name,
      matrixId: formData.id!, // đảm bảo tồn tại
      startTime: formData.startTime,
      endTime: formData.endTime,
      shuffleQuestions: isShuffleQuestion,
      questions: formData.questions?.map((q) => ({
        questionId: q.questionId,
        finalPoints: q.finalPoints,
      })),
    };

    updateMutation.mutate(
      { id: formData.id, payload },
      {
        onSuccess: () => {
          onSave(); // trigger refetch outside
          onOpenChange(false); // close modal
          addToast({
            title: 'Thay đổi bài thi thành công',
            color: 'success',
            timeout: 2000,
          });
        },
        onError: (err) => {
          addToast({
            title: 'Có lỗi xảy ra khi cập nhật đề thi!',
            color: 'danger',
            timeout: 2000,
          });
        },
      }
    );
  };

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
            <ModalHeader>Chỉnh sửa đề thi</ModalHeader>
            <ModalBody>
              <div className='space-y-6'>
                {/* Basic exam details */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Input
                    label='Mã đề thi'
                    placeholder='Nhập mã đề thi'
                    value={formData.code || ''}
                    onValueChange={(value) => handleInputChange('code', value)}
                  />

                  <Input
                    isRequired
                    label='Tên đề thi'
                    placeholder='Nhập tên đề thi'
                    value={formData.name}
                    onValueChange={(value) => handleInputChange('name', value)}
                  />
                </div>

                {/* Shuffle checkbox */}
                <div className='mt-2'>
                  <Checkbox
                    isSelected={isShuffleQuestion}
                    onValueChange={(value: boolean) =>
                      setIsShuffleQuestion(value)
                    }
                  >
                    Xáo trộn thứ tự câu hỏi
                  </Checkbox>
                </div>

                {/* Date range picker */}
                <ExamDateRangePicker
                  endTime={formData.endTime}
                  startTime={formData.startTime}
                  onDateRangeChange={handleDateRangeChange}
                />

                <Divider />

                {/* Questions */}
                <div className='space-y-4'>
                  <h4 className='text-lg font-medium'>Danh sách câu hỏi</h4>
                  {!formData.questions || formData.questions.length === 0 ? (
                    <div className='text-center py-4 text-default-400'>
                      Không có câu hỏi nào trong đề thi này
                    </div>
                  ) : (
                    <Accordion
                      selectionMode='multiple'
                      variant='splitted'
                    >
                      {(formData.questions ?? []).map((question, index) => (
                        <AccordionItem
                          key={question.questionId}
                          title={
                            <div className='flex items-center justify-between w-full pr-2'>
                              <div className='flex-1'>
                                <Input
                                  className='max-w-md'
                                  label={`Câu ${index + 1}`}
                                  size='sm'
                                  value={question.content}
                                  onClick={(e) => e.stopPropagation()}
                                  onValueChange={(value) =>
                                    handleQuestionChange(
                                      question.questionId,
                                      'content',
                                      value
                                    )
                                  }
                                />
                              </div>
                              <Input
                                className='w-24'
                                label='Điểm'
                                min={0}
                                size='sm'
                                step={0.5}
                                type='number'
                                value={question.finalPoints.toString()}
                                onClick={(e) => e.stopPropagation()}
                                onValueChange={(value) =>
                                  handleQuestionChange(
                                    question.questionId,
                                    'finalPoints',
                                    parseFloat(value) || 0
                                  )
                                }
                              />
                            </div>
                          }
                        >
                          <div className='space-y-3 px-2 pt-2'>
                            <p className='font-medium'>Các lựa chọn:</p>
                            <div className='space-y-3'>
                              {(question.options ?? []).map((option) => (
                                <div
                                  key={option.id}
                                  className='p-3 rounded-md border border-default-200'
                                >
                                  <div className='flex items-center gap-3'>
                                    <Checkbox
                                      color='success'
                                      isSelected={option.isCorrect}
                                      size='sm'
                                      onValueChange={(value) =>
                                        handleOptionChange(
                                          question.questionId,
                                          option.id,
                                          'isCorrect',
                                          value
                                        )
                                      }
                                    >
                                      Đáp án đúng
                                    </Checkbox>

                                    <div className='flex-1'>
                                      <Input
                                        placeholder='Nội dung lựa chọn'
                                        size='sm'
                                        value={option.content}
                                        onValueChange={(value) =>
                                          handleOptionChange(
                                            question.questionId,
                                            option.id,
                                            'content',
                                            value
                                          )
                                        }
                                      />
                                    </div>
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
                color='default'
                variant='flat'
                onPress={onClose}
              >
                Hủy
              </Button>
              <Button
                color='primary'
                isLoading={updateMutation.isPending}
                startContent={
                  !updateMutation.isPending && <Icon icon='lucide:save' />
                }
                onPress={handleSave}
              >
                Lưu thay đổi
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
