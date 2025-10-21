import React from 'react';
import { Input, Checkbox, Form, addToast } from '@heroui/react';

import { useCreateExam } from '@/hooks/useExam'; // hook bạn cung cấp
import { CreateExamRequest, ExamQuestionRequest } from '@/types/exam';
import { MatrixSelector } from '@/components/exam/matrix-selector';
import { ExamDateRangePicker } from '@/components/exam/exam-date-range-picker';
import { QuestionSelector } from '@/components/exam/question-selector';
interface CreateExamFormProps {
  formData: CreateExamRequest;
  setFormData: React.Dispatch<React.SetStateAction<CreateExamRequest>>;
}

export const CreateExamForm: React.FC<CreateExamFormProps> = ({
  formData,
  setFormData,
}) => {
  const createExamMutation = useCreateExam();

  // const [formData, setFormData] = useState<CreateExamRequest>({
  //   name: '',
  //   matrixId: 0,
  //   shuffleQuestions: false,
  //   questions: [],
  // });

  const handleInputChange = (field: keyof CreateExamRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionsChange = (questions: ExamQuestionRequest[]) => {
    setFormData((prev) => ({ ...prev, questions }));
  };

  const handleDateRangeChange = (startTime?: string, endTime?: string) => {
    setFormData((prev) => ({ ...prev, startTime, endTime }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExamMutation.mutateAsync(formData);

      addToast({
        title: 'Đề thi đã được tạo thành công!',
        color: 'success',
        timeout: 2000,
      });
      setFormData({
        name: '',
        matrixId: 0,
        shuffleQuestions: false,
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
    <Form
      className='space-y-6'
      onSubmit={handleSubmit}
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Input
          label='Mã đề thi'
          placeholder='Nhập mã đề thi (tùy chọn)'
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

      <MatrixSelector
        selectedMatrixId={formData.matrixId}
        onMatrixSelect={(id) => handleInputChange('matrixId', id)}
      />

      <ExamDateRangePicker
        endTime={formData.endTime}
        startTime={formData.startTime}
        onDateRangeChange={handleDateRangeChange}
      />

      <div className='flex items-center'>
        <Checkbox
          isSelected={formData.shuffleQuestions}
          onValueChange={(value) =>
            handleInputChange('shuffleQuestions', value)
          }
        >
          Xáo trộn thứ tự câu hỏi
        </Checkbox>
      </div>

      <QuestionSelector
        matrixId={formData.matrixId}
        selectedQuestions={formData.questions || []}
        onQuestionsChange={handleQuestionsChange}
      />

      {/* <div className='flex justify-end gap-2'>
        <Button
          color='default'
          type='button'
          variant='flat'
          onPress={() =>
            setFormData({
              name: '',
              matrixId: 0,
              shuffleQuestions: false,
              questions: [],
            })
          }
        >
          Hủy
        </Button> */}

      {/* <Button
          color='primary'
          isLoading={createExamMutation.isPending}
          startContent={
            !createExamMutation.isPending && <Icon icon='lucide:save' />
          }
          type='submit'
        >
          Tạo đề thi
        </Button> */}
      {/* </div> */}
    </Form>
  );
};
