import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Spinner,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { ExamQuestionRequest } from '@/types/exam';
import { useMatrix } from '@/hooks/useMatrix';
import { useQuestionsByMatrix } from '@/hooks/useQuestion';

interface QuestionSelectorProps {
  matrixId: number;
  selectedQuestions: ExamQuestionRequest[];
  onQuestionsChange: (questions: ExamQuestionRequest[]) => void;
}

export const QuestionSelector: React.FC<QuestionSelectorProps> = ({
  matrixId,
  selectedQuestions,
  onQuestionsChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: matrix, isLoading: isMatrixLoading } = useMatrix(matrixId);
  const lessonIds = matrix?.matrixDetails.map((d) => d.lesson.id) || [];
  const { data: questions = [], isLoading: isQuestionsLoading } =
    useQuestionsByMatrix(lessonIds);

  const isLoading = isMatrixLoading || isQuestionsLoading;

  // Mảng key của các câu hỏi đã chọn
  const selectedKeys = selectedQuestions.map((q) => q.questionId.toString());

  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return questions;

    return questions.filter(
      (q) =>
        q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.level?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.questionType?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [questions, searchQuery]);

  // Xử lý chọn/bỏ chọn nhiều dòng
  const handleSelectionChange = (keys: Set<React.Key>) => {
    const stringKeys = new Set(Array.from(keys).map((k) => k.toString()));
    const newSelected = filteredQuestions
      .filter((q) => stringKeys.has(q.id.toString()))
      .map((q) => ({
        questionId: q.id,
        finalPoints: q.level?.points ?? 0,
      }));

    onQuestionsChange(newSelected);
  };

  if (isLoading) {
    return (
      <div className='py-4 flex justify-center'>
        <Spinner label='Đang tải danh sách câu hỏi...' />
      </div>
    );
  }

  if (!lessonIds.length) {
    return (
      <div className='text-center py-8 text-default-500'>
        Vui lòng chọn ma trận đề thi để xem danh sách câu hỏi
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold'>Danh sách câu hỏi</h3>
        <div className='flex gap-2 items-center'>
          <Input
            className='w-64'
            placeholder='Tìm kiếm câu hỏi...'
            size='sm'
            startContent={<Icon icon='lucide:search' />}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </div>
      </div>

      <div className='border rounded-md'>
        <Table
          isHeaderSticky
          removeWrapper
          aria-label='Danh sách câu hỏi'
          selectedKeys={selectedKeys}
          selectionMode='multiple'
          onSelectionChange={(keys) =>
            handleSelectionChange(keys as Set<React.Key>)
          }
        >
          <TableHeader>
            <TableColumn>NỘI DUNG</TableColumn>
            <TableColumn width={120}>MỨC ĐỘ</TableColumn>
            <TableColumn width={120}>LOẠI</TableColumn>
            <TableColumn width={120}>ĐIỂM</TableColumn>
          </TableHeader>
          <TableBody items={filteredQuestions}>
            {(question) => (
              <TableRow key={question.id}>
                <TableCell>{question.content}</TableCell>
                <TableCell>
                  <div
                    className={`px-2 py-1 rounded text-center text-xs ${
                      question.level?.name === 'Dễ'
                        ? 'bg-success-100 text-success-700'
                        : question.level?.name === 'Trung bình'
                          ? 'bg-warning-100 text-warning-700'
                          : 'bg-danger-100 text-danger-700'
                    }`}
                  >
                    {question.level?.name}
                  </div>
                </TableCell>
                <TableCell>{question.questionType?.name}</TableCell>
                <TableCell>{question.level?.points ?? 0}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex justify-between items-center pt-2'>
        <div className='text-sm text-default-500'>
          Đã chọn {selectedQuestions.length} câu hỏi
        </div>
        <div className='text-sm font-medium'>
          Tổng điểm:{' '}
          {selectedQuestions.reduce((sum, q) => sum + (q.finalPoints || 0), 0)}
        </div>
      </div>
    </div>
  );
};
