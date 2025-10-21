import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import { LessonPayload } from '@/types/lesson';

interface LessonCardProps {
  lesson: LessonPayload;
  onSelect?: (lessonId: number) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onSelect }) => {
  return (
    <Card
      // isPressable
      className='shadow-sm hover:shadow-md transition'
      onPress={() => onSelect?.(lesson.id)}
    >
      <CardHeader className='flex gap-3 items-center'>
        <Icon
          className='text-primary'
          icon='lucide:file-text'
        />
        <div className='flex flex-col'>
          <p className='text-md font-semibold'>{lesson.name}</p>
          <p className='text-xs text-default-500'>
            Thứ tự: {lesson.orderIndex}
          </p>
        </div>
      </CardHeader>

      <CardBody className='text-sm text-default-600 line-clamp-3'>
        {lesson.description || 'Không có mô tả.'}
      </CardBody>

      <CardFooter className='flex justify-end'>
        <Button
          color='primary'
          size='sm'
          startContent={<Icon icon='lucide:arrow-right' />}
          variant='light'
          onPress={() => onSelect?.(lesson.id)}
        >
          Xem câu hỏi
        </Button>
      </CardFooter>
    </Card>
  );
};
