import React from 'react';
import { Input } from '@heroui/react';

interface ExamDateRangePickerProps {
  startTime?: string;
  endTime?: string;
  onDateRangeChange: (startTime?: string, endTime?: string) => void;
}

export const ExamDateRangePicker: React.FC<ExamDateRangePickerProps> = ({
  startTime,
  endTime,
  onDateRangeChange,
}) => {
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
  };

  const handleStartTimeChange = (value: string) => {
    const newStartTime = value ? new Date(value).toISOString() : undefined;

    onDateRangeChange(newStartTime, endTime);
  };

  const handleEndTimeChange = (value: string) => {
    const newEndTime = value ? new Date(value).toISOString() : undefined;

    onDateRangeChange(startTime, newEndTime);
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <Input
        description='Để trống nếu không giới hạn thời gian bắt đầu'
        label='Thời gian bắt đầu'
        placeholder='Chọn thời gian bắt đầu'
        type='datetime-local'
        value={formatDateForInput(startTime)}
        onChange={(e) => handleStartTimeChange(e.target.value)}
      />

      <Input
        description='Để trống nếu không giới hạn thời gian kết thúc'
        isDisabled={!startTime}
        label='Thời gian kết thúc'
        placeholder='Chọn thời gian kết thúc'
        type='datetime-local'
        value={formatDateForInput(endTime)}
        onChange={(e) => handleEndTimeChange(e.target.value)}
      />
    </div>
  );
};
