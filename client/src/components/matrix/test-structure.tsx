import React, { useState } from 'react';
import { Input, Select, SelectItem, Button, addToast } from '@heroui/react';
import { Icon } from '@iconify/react';

import { useGradeSubjectStore } from '@/store/grade-subject.store';
import { useMatrixStore } from '@/store/matrix.store';
import { useGrades } from '@/hooks/useGrades';

export const TestStructure: React.FC = () => {
  const addStructure = useMatrixStore((s: any) => s.addStructure);
  const { setMatrixInfo } = useMatrixStore();
  const { data: grades = [], isLoading: loadingGrades } = useGrades();
  const structures = useMatrixStore((s) => s.structures);

  const {
    subjects,
    chapters,
    lessons,
    levels,
    questionTypes,
    loading,
    selectedGradeId,
    selectedSubjectId,
    selectedChapterId,
    selectedLessonId,
    selectedLevelId,
    selectedQuestionTypeId,
    setGrade,
    setSubject,
    setChapter,
    setLesson,
    setLevel,
    setQuestionType,
  } = useGradeSubjectStore();

  const [matrixName, setMatrixName] = useState('');
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [description, setDescription] = useState('');

  const [questionCount, setQuestionCount] = useState<number>(0);

  const canSubmit =
    selectedGradeId &&
    selectedSubjectId &&
    selectedChapterId &&
    selectedLessonId &&
    selectedLevelId &&
    selectedQuestionTypeId &&
    questionCount > 0;

  const handleAdd = () => {
    if (!canSubmit) {
      addToast({
        title: 'Thiếu thông tin',
        description: 'Vui lòng điền đầy đủ thông tin!',
        color: 'warning',
        timeout: 2000,
      });

      return;
    }

    if (!matrixName || totalQuestions <= 0) {
      addToast({
        title: 'Tổng số câu hỏi không hợp lệ',
        description: 'Vui lòng nhập tổng số câu hỏi lớn hơn 0',
        color: 'danger',
        timeout: 2000,
      });

      return;
    }

    // Kiểm tra duplicate: chapterId + lessonId + levelId + questionTypeId
    const isDuplicate = structures.some(
      (s) =>
        s.chapterId === selectedChapterId &&
        s.lessonId === selectedLessonId &&
        s.levelId === selectedLevelId &&
        s.questionTypeId === selectedQuestionTypeId
    );

    if (isDuplicate) {
      addToast({
        title: 'Cấu trúc đã tồn tại',
        description:
          'Cấu trúc này đã tồn tại! Vui lòng chọn level hoặc loại câu hỏi khác, hoặc chuyển sang bài học khác.',
        color: 'warning',
        timeout: 2000,
      });

      return;
    }
    // Kiểm tra tổng số câu hỏi nếu thêm mới có vượt quá totalQuestions
    const totalCurrent = structures.reduce(
      (sum, s) => sum + (s.questionCount || 0),
      0
    );

    if (totalCurrent + questionCount > totalQuestions) {
      addToast({
        title: 'Quá số câu hỏi',
        description: `Tổng số câu hỏi (${totalCurrent + questionCount}) vượt quá tổng số câu hỏi cho phép (${totalQuestions}).`,
        color: 'danger',
        timeout: 2000,
      });

      return;
    }

    // Check questionCount > totalQuestions
    if (questionCount > totalQuestions) {
      addToast({
        title: 'Số câu hỏi quá lớn',
        description:
          'Số câu hỏi cho cấu trúc không được lớn hơn tổng số câu hỏi.',
        color: 'danger',
        timeout: 2000,
      });

      return; // <-- chặn thêm
    }

    // Nếu đã add structure, chặn đổi grade và subject
    if (structures.length > 0) {
      if (selectedGradeId !== structures[0].gradeId) {
        addToast({
          title: 'Cấu trúc đã tồn tại',
          description:
            'Vui lòng chọn level hoặc loại câu hỏi khác, hoặc chuyển sang bài học khác.',
          color: 'warning',
          timeout: 2000,
        });

        return;
      }
      if (selectedSubjectId !== structures[0].subjectId) {
        addToast({
          title: 'Không thể thay đổi lớp học',
          description: 'Bạn không thể thay đổi lớp học khi đã thêm cấu trúc!',
          color: 'danger',
          timeout: 2000,
        });

        return;
      }
    }

    setMatrixInfo({
      name: matrixName,
      description: description,
      totalQuestions: totalQuestions,
    });

    addStructure({
      gradeId: selectedGradeId,
      subjectId: selectedSubjectId,
      chapterId: selectedChapterId,
      lessonId: selectedLessonId,
      levelId: selectedLevelId,
      questionTypeId: selectedQuestionTypeId,
      questionCount,
    });
  };

  return (
    <div>
      <div className='flex items-center gap-2 p-4 border-b'>
        <Icon
          className='text-amber-600'
          icon='lucide:edit'
        />
        <span className='font-medium text-lg'>
          1. Xây dựng cấu trúc ma trận
        </span>
      </div>

      <div className='p-4'>
        <Input
          isRequired
          className='mt-4'
          label='Tên ma trận'
          placeholder='Nhập tên ma trận...'
          value={matrixName}
          onChange={(e) => setMatrixName(e.target.value)}
        />
        <Input
          isRequired
          className='mt-4'
          label='Tổng số câu hỏi'
          min={1}
          placeholder='Nhập tổng số câu hỏi'
          type='number'
          value={totalQuestions > 0 ? String(totalQuestions) : ''}
          onChange={(e) => setTotalQuestions(Number(e.target.value))}
        />
        <Input
          className='mt-4'
          label='Mô tả'
          placeholder='Nhập mô tả'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Select
          className='mt-4'
          isDisabled={
            (!matrixName && !totalQuestions) || !matrixName || !totalQuestions
          }
          isLoading={loading}
          label='Lớp học'
          selectedKeys={selectedGradeId ? [String(selectedGradeId)] : []}
          onChange={(e) => setGrade(Number(e.target.value))}
        >
          {/* Bạn có thể lấy danh sách grade từ store riêng hoặc props */}
          {grades.map((g) => (
            <SelectItem key={g.id}>{`Lớp ${g.name}`}</SelectItem>
          ))}
        </Select>

        <Select
          className='mt-4'
          isDisabled={
            (!matrixName && !totalQuestions) || !matrixName || !totalQuestions
          }
          isLoading={loading}
          label='Môn học'
          selectedKeys={selectedSubjectId ? [String(selectedSubjectId)] : []}
          onChange={(e) => setSubject(Number(e.target.value))}
        >
          {subjects?.map((s) => <SelectItem key={s.id}>{s.name}</SelectItem>) ??
            []}
        </Select>

        <Select
          className='mt-4'
          isDisabled={
            (!matrixName && !totalQuestions) || !matrixName || !totalQuestions
          }
          isLoading={loading}
          label='Chương'
          selectedKeys={selectedChapterId ? [String(selectedChapterId)] : []}
          onChange={(e) => setChapter(Number(e.target.value))}
        >
          {chapters?.map((c) => <SelectItem key={c.id}>{c.name}</SelectItem>) ??
            []}
        </Select>

        <Select
          className='mt-4'
          isDisabled={
            (!matrixName && !totalQuestions) || !matrixName || !totalQuestions
          }
          isLoading={loading}
          label='Bài học'
          selectedKeys={selectedLessonId ? [String(selectedLessonId)] : []}
          onChange={(e) => setLesson(Number(e.target.value))}
        >
          {lessons?.map((l) => <SelectItem key={l.id}>{l.name}</SelectItem>) ??
            []}
        </Select>

        <Select
          className='mt-4'
          isDisabled={
            (!matrixName && !totalQuestions) || !matrixName || !totalQuestions
          }
          label='Cấp độ'
          selectedKeys={selectedLevelId ? [String(selectedLevelId)] : []}
          onChange={(e) => setLevel(Number(e.target.value))}
        >
          {levels?.map((lv) => (
            <SelectItem key={lv.id}>{lv.name}</SelectItem>
          )) ?? []}
        </Select>
        <Input
          className='mt-4'
          isDisabled={
            (!matrixName && !totalQuestions) || !matrixName || !totalQuestions
          }
          label='Số câu hỏi'
          min={1}
          type='number'
          value={questionCount > 0 ? String(questionCount) : ''}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
        />

        <Select
          className='mt-4'
          isDisabled={
            (!matrixName && !totalQuestions) || !matrixName || !totalQuestions
          }
          label='Loại câu hỏi'
          selectedKeys={
            selectedQuestionTypeId ? [String(selectedQuestionTypeId)] : []
          }
          onChange={(e) => setQuestionType(Number(e.target.value))}
        >
          {questionTypes?.map((qt) => (
            <SelectItem key={qt.id}>{qt.name}</SelectItem>
          )) ?? []}
        </Select>

        <Button
          className='mt-6 w-full'
          color='primary'
          disabled={!canSubmit}
          isDisabled={
            (!matrixName && !totalQuestions) || !matrixName || !totalQuestions
          }
          startContent={<Icon icon='lucide:plus' />}
          onPress={handleAdd}
        >
          Thêm vào cấu trúc
        </Button>
      </div>
    </div>
  );
};
