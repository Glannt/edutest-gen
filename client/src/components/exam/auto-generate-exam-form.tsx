import React from 'react';
import {
  Button,
  Input,
  Checkbox,
  Switch,
  Form,
  Divider,
  addToast,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import {
  AutoGenerateExamRequest,
  AutoGenerateExamListRequest,
} from '../../types/exam';

import { MatrixSelector } from './matrix-selector';
import { ExamDateRangePicker } from './exam-date-range-picker';

import { useAutoGenerateExam, useAutoGenerateExamList } from '@/hooks/useExam';

export const AutoGenerateExamForm: React.FC = () => {
  const [isMultipleExams, setIsMultipleExams] = React.useState(false);

  const [singleExamData, setSingleExamData] =
    React.useState<AutoGenerateExamRequest>({
      name: '',
      matrixId: 0,
      numberOfQuestions: 10,
      shuffleQuestions: true,
      shuffleOptions: true,
    });

  const [multipleExamsData, setMultipleExamsData] =
    React.useState<AutoGenerateExamListRequest>({
      baseCode: '',
      name: '',
      matrixId: 0,
      numberOfQuestions: 10,
      numberOfExams: 5,
      shuffleQuestions: true,
      shuffleOptions: true,
    });

  const autoGenerateSingle = useAutoGenerateExam();
  const autoGenerateMultiple = useAutoGenerateExamList();

  const handleSingleExamChange = (
    field: keyof AutoGenerateExamRequest,
    value: any
  ) => {
    setSingleExamData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMultipleExamsChange = (
    field: keyof AutoGenerateExamListRequest,
    value: any
  ) => {
    setMultipleExamsData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateRangeChange = (startTime?: string, endTime?: string) => {
    if (isMultipleExams) {
      setMultipleExamsData((prev) => ({ ...prev, startTime, endTime }));
    } else {
      setSingleExamData((prev) => ({ ...prev, startTime, endTime }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isMultipleExams) {
        await autoGenerateMultiple.mutateAsync(multipleExamsData);
        addToast({
          title: `${multipleExamsData.numberOfExams} đề thi đã được tạo thành công!`,
          color: 'success',
          timeout: 2000,
        });
        setMultipleExamsData({
          baseCode: '',
          name: '',
          matrixId: 0,
          numberOfQuestions: 10,
          numberOfExams: 5,
          shuffleQuestions: true,
          shuffleOptions: true,
        });
      } else {
        await autoGenerateSingle.mutateAsync(singleExamData);
        addToast({
          title: `Đề thi "${singleExamData.name}" đã được tạo thành công!`,
          color: 'success',
          timeout: 2000,
        });
        setSingleExamData({
          name: '',
          matrixId: 0,
          numberOfQuestions: 10,
          shuffleQuestions: true,
          shuffleOptions: true,
        });
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi tạo đề thi!');
    }
  };

  const currentData = isMultipleExams ? multipleExamsData : singleExamData;
  const isSubmitting = isMultipleExams
    ? autoGenerateMultiple.isPending
    : autoGenerateSingle.isPending;

  return (
    <Form
      className='space-y-6'
      onSubmit={handleSubmit}
    >
      {/* Switch between single/multiple */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <span className='text-default-600'>Tạo một đề thi</span>
          <Switch
            color='primary'
            isSelected={isMultipleExams}
            size='sm'
            onValueChange={setIsMultipleExams}
          />
          <span className='text-default-600'>Tạo nhiều đề thi</span>
        </div>
      </div>

      <Divider className='my-4' />

      {/* Inputs */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {isMultipleExams ? (
          <Input
            description='Các đề thi sẽ được đánh số theo mã này (VD: EXAM001, EXAM002...)'
            label='Mã đề thi gốc'
            placeholder='Nhập mã đề thi gốc'
            value={multipleExamsData.baseCode || ''}
            onValueChange={(value) =>
              handleMultipleExamsChange('baseCode', value)
            }
          />
        ) : (
          <Input
            label='Mã đề thi'
            placeholder='Nhập mã đề thi (tùy chọn)'
            value={singleExamData.code || ''}
            onValueChange={(value) => handleSingleExamChange('code', value)}
          />
        )}

        <Input
          isRequired
          label='Tên đề thi'
          placeholder='Nhập tên đề thi'
          value={currentData.name}
          onValueChange={(value) => {
            if (isMultipleExams) handleMultipleExamsChange('name', value);
            else handleSingleExamChange('name', value);
          }}
        />
      </div>

      <MatrixSelector
        selectedMatrixId={currentData.matrixId}
        onMatrixSelect={(id) => {
          if (isMultipleExams) handleMultipleExamsChange('matrixId', id);
          else handleSingleExamChange('matrixId', id);
        }}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Input
          isRequired
          label='Số lượng câu hỏi'
          min={1}
          placeholder='Nhập số lượng câu hỏi'
          type='number'
          value={currentData.numberOfQuestions.toString()}
          onValueChange={(value) => {
            const num = parseInt(value) || 0;

            if (isMultipleExams)
              handleMultipleExamsChange('numberOfQuestions', num);
            else handleSingleExamChange('numberOfQuestions', num);
          }}
        />
        {isMultipleExams && (
          <Input
            isRequired
            label='Số lượng đề thi'
            min={1}
            placeholder='Nhập số lượng đề thi cần tạo'
            type='number'
            value={multipleExamsData.numberOfExams.toString()}
            onValueChange={(value) => {
              const num = parseInt(value) || 0;

              handleMultipleExamsChange('numberOfExams', num);
            }}
          />
        )}
      </div>

      <ExamDateRangePicker
        endTime={currentData.endTime}
        startTime={currentData.startTime}
        onDateRangeChange={handleDateRangeChange}
      />

      <div className='flex flex-col gap-2'>
        <Checkbox
          isSelected={currentData.shuffleQuestions}
          onValueChange={(value) => {
            if (isMultipleExams)
              handleMultipleExamsChange('shuffleQuestions', value);
            else handleSingleExamChange('shuffleQuestions', value);
          }}
        >
          Xáo trộn thứ tự câu hỏi
        </Checkbox>
        <Checkbox
          isSelected={currentData.shuffleOptions}
          onValueChange={(value) => {
            if (isMultipleExams)
              handleMultipleExamsChange('shuffleOptions', value);
            else handleSingleExamChange('shuffleOptions', value);
          }}
        >
          Xáo trộn thứ tự các lựa chọn
        </Checkbox>
      </div>

      {/* Submit */}
      <div className='flex justify-end gap-2'>
        <Button
          color='default'
          type='button'
          variant='flat'
        >
          Hủy
        </Button>
        <Button
          color='primary'
          isLoading={isSubmitting}
          startContent={!isSubmitting && <Icon icon='lucide:zap' />}
          type='submit'
        >
          {isMultipleExams ? 'Tạo các đề thi' : 'Tạo đề thi'}
        </Button>
      </div>
    </Form>
  );
};
