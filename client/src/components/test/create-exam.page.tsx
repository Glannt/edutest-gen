import React, { useState } from 'react';
import { Button, addToast } from '@heroui/react';
import { Icon } from '@iconify/react';

import { CreateExamForm } from '@/components/exam/create-exam-form';
import { ExamPreviewPanel } from '@/components/test/exam-preview-panel';
import { useCreateExam } from '@/hooks/useExam';
import { CreateExamRequest } from '@/types/exam';

export default function CreateExamPage() {
  const [examData, setExamData] = useState<CreateExamRequest>({
    name: '',
    code: '',
    matrixId: 0,
    shuffleQuestions: false,
    startTime: undefined,
    endTime: undefined,
    questions: [],
  });

  const createExamMutation = useCreateExam();

  const handleCreateExam = async () => {
    try {
      await createExamMutation.mutateAsync(examData);

      addToast({
        title: 'Đề thi đã được tạo thành công!',
        color: 'success',
        timeout: 2000,
      });

      setExamData({
        name: '',
        code: '',
        matrixId: 0,
        shuffleQuestions: false,
        startTime: undefined,
        endTime: undefined,
        questions: [],
      });
    } catch (error) {
      addToast({
        title: 'Có lỗi xảy ra khi tạo đề thi!',
        description: String(error),
        color: 'danger',
        timeout: 2000,
      });
    }
  };

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Form nhập dữ liệu */}
        <CreateExamForm
          formData={examData}
          setFormData={setExamData}
        />

        {/* Xem trước đề thi (cập nhật realtime) */}
        <div className='flex flex-col'>
          <ExamPreviewPanel
            exam={examData}
            onExamChange={(updatedExam) => setExamData(updatedExam)}
          />

          {/* Nút tạo đề thi */}
        </div>
      </div>
      <div className='flex justify-start mt-4'>
        <Button
          color='primary'
          isLoading={createExamMutation.isPending}
          startContent={
            !createExamMutation.isPending && <Icon icon='lucide:save' />
          }
          onPress={handleCreateExam}
        >
          Tạo đề thi
        </Button>
      </div>
    </>
  );
}
