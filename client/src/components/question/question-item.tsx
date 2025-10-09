import React from 'react';
import { Checkbox, Card, Chip, Tooltip, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import { QuestionPayload } from '@/types/question';
import { OptionPayload } from '@/types/option';

interface QuestionItemProps {
  question: QuestionPayload;
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className='p-4 shadow-sm flex justify-between items-start'>
      {/* Left side: checkbox + content */}
      <div className='flex-1 flex gap-3'>
        <Checkbox
          className='mt-1'
          isSelected={isSelected}
          onValueChange={onSelect}
        />

        <div className='flex-1'>
          {/* Header: số câu, level, type */}
          <div className='flex items-center gap-2 mb-2'>
            <span className='font-medium'>Câu {question.id}</span>
            {question.level?.name && (
              <Chip
                className='bg-default-100 text-default-700'
                size='sm'
                variant='flat'
              >
                {question.level.name}
              </Chip>
            )}
            {question.questionType?.name && (
              <Chip
                className='bg-default-200 text-default-800'
                size='sm'
                variant='flat'
              >
                {question.questionType.name}
              </Chip>
            )}
          </div>

          {/* Nội dung câu hỏi */}
          <p className='mb-3 text-foreground'>{question.content}</p>

          {/* Options */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            {question.options?.map((option: Partial<OptionPayload>, idx) => (
              <div
                key={option.id}
                className='flex gap-2'
              >
                <span className='font-medium'>
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span
                  className={
                    option.isCorrect
                      ? 'text-success-600 font-medium'
                      : undefined
                  }
                >
                  {option.content}
                </span>
              </div>
            ))}
          </div>

          {/* Giải thích / đáp án */}
          {question.explanation && (
            <div className='border-t border-default-200 pt-2 mt-2 text-default-500 text-sm'>
              Giải thích: {question.explanation}
            </div>
          )}
        </div>
      </div>

      {/* Right side: actions */}
      <div className='flex flex-row gap-2 w-1/6 items-end'>
        {onEdit && (
          <Tooltip content='Sửa'>
            <Button
              color='secondary'
              variant='flat'
              onPress={onEdit}
            >
              <Icon
                className='text-sm mr-1'
                icon='lucide:edit'
              />{' '}
              Sửa
            </Button>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip content='Xóa'>
            <Button
              color='danger'
              variant='flat'
              onPress={onDelete}
            >
              <Icon
                className='text-sm mr-1'
                icon='lucide:trash-2'
              />{' '}
              Xóa
            </Button>
          </Tooltip>
        )}
      </div>
    </Card>
  );
};
