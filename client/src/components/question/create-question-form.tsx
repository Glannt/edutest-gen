import type { QuestionPayload } from '@/types/question';

import React, { useState } from 'react';
import {
  Form,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Spinner,
  Checkbox,
  addToast,
} from '@heroui/react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

import { LevelPayload } from '@/types/level';
import { QuestionTypePayload } from '@/types/question-type';
import { useLevels } from '@/hooks/useLevels';
import { useQuestionTypes } from '@/hooks/useQuestionTypes';
import { OptionPayload } from '@/types/option';
import { useSubject } from '@/hooks/useSubjects';
import { useGrade } from '@/hooks/useGrades';
import { useChapter } from '@/hooks/useChapter';
import { RecheckModal } from '@/components/question/modal/recheck-modal';
import { useCreateQuestion } from '@/hooks/useQuestion';

interface CreateQuestionProps {
  selectedGrade?: number | undefined;
  selectedSubject?: number | undefined;
  selectedChapter?: number | undefined;
  selectedLesson?: number | undefined;
}

export default function CreateQuestionForm({
  selectedGrade,
  selectedSubject,
  selectedChapter,
  selectedLesson,
}: CreateQuestionProps) {
  // --- Route param fallback ---
  const params = useParams<{ lessonId?: string }>();
  const lessonIdFromRoute = params.lessonId ? Number(params.lessonId) : null;

  // --- hook mutation ---
  const { mutateAsync: createQuestion, isPending } = useCreateQuestion();

  // --- State ---
  const [question, setQuestion] = useState<Partial<QuestionPayload>>({
    lessonId: selectedLesson ?? lessonIdFromRoute ?? undefined,
  });

  const [options, setOptions] = useState<Partial<OptionPayload>[]>([
    { content: '', isCorrect: false, orderIndex: 1 },
    { content: '', isCorrect: false, orderIndex: 2 },
    { content: '', isCorrect: false, orderIndex: 3 },
    { content: '', isCorrect: false, orderIndex: 4 },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Partial<QuestionPayload> | null>(
    null
  );
  const [showConfirm, setShowConfirm] = useState(false);
  // --- API Hooks ---
  const { data: levels = [], isLoading: isLevelsLoading } = useLevels();
  const { data: questionTypes = [], isLoading: isQTypesLoading } =
    useQuestionTypes();

  const { data: subject, isLoading: isSubjectLoading } =
    useSubject(selectedSubject);

  const { data: grade, isLoading: isGradeLoading } = useGrade(selectedGrade);
  const { data: chapter, isLoading: isChapterLoading } =
    useChapter(selectedChapter);

  // --- Validate form ---
  const validate = (data: Partial<QuestionPayload>) => {
    const newErrors: Record<string, string> = {};

    if (!data.content || data.content.trim() === '')
      newErrors.content = 'Nội dung câu hỏi là bắt buộc';
    if (!data.lessonId) newErrors.lessonId = 'Bài học là bắt buộc';
    if (!data.levelId) newErrors.levelId = 'Mức độ là bắt buộc';
    if (!data.questionTypeId)
      newErrors.questionTypeId = 'Loại câu hỏi là bắt buộc';

    // Validate options
    const validOptions = options.filter((o) => o?.content?.trim() !== '');

    if (validOptions.length < 2) {
      newErrors.options = 'Phải có ít nhất 2 lựa chọn hợp lệ';
    }
    const hasCorrect = options.some((o) => o.isCorrect);

    if (!hasCorrect) {
      newErrors.correctAnswer = 'Phải chọn ít nhất 1 đáp án đúng';
    }

    return newErrors;
  };

  // --- Submit form ---
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate(question);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    const payload: QuestionPayload = {
      id: 0,
      content: question.content!,
      explanation: question.explanation ?? '',
      lessonId: question.lessonId!,
      levelId: question.levelId!,
      questionTypeId: question.questionTypeId!,
      options: options.map((opt) => ({
        ...opt,
        questionId: question.id,
      })),
    };

    setSubmitted(payload);
    console.log('📦 Submit Question Payload:', payload);
  };

  const handleConfirmSubmit = async () => {
    const newErrors = validate(question);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowConfirm(false);

      return;
    }

    const payload: Partial<QuestionPayload> = {
      content: question.content!,
      explanation: question.explanation ?? '',
      lessonId: question.lessonId!,
      levelId: question.levelId!,
      questionTypeId: question.questionTypeId!,
      options: options.map((opt) => ({
        content: opt.content,
        isCorrect: opt.isCorrect,
        orderIndex: opt.orderIndex,
      })),
    };

    setSubmitted(payload);
    console.log('📦 Submit Question Payload:', payload);

    try {
      // 🧩 Gọi API tạo câu hỏi
      const res = await createQuestion(payload);

      setSubmitted(res);
      setShowConfirm(false);

      // ✅ Thông báo thành công
      addToast({
        title: 'Thành công',
        description: 'Câu hỏi đã được tạo thành công!',
        color: 'success',
        timeout: 1500,
      });
    } catch (err: any) {
      console.error('❌ Error creating question:', err);

      addToast({
        title: 'Lỗi',
        description: err?.message ?? 'Không thể tạo câu hỏi',
        color: 'danger',
        timeout: 1500,
      });
    }
    setShowConfirm(false);
  };

  // --- Handle Option Updates ---
  const updateOption = (
    index: number,
    field: keyof Partial<OptionPayload>,
    value: any
  ) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt))
    );
  };

  const toggleCorrect = (index: number) => {
    setOptions((prev) =>
      prev.map((opt, i) => ({
        ...opt,
        isCorrect: i === index ? !opt.isCorrect : opt.isCorrect,
      }))
    );
  };

  // --- Loading state ---
  if (isLevelsLoading || isQTypesLoading) {
    return (
      <div className='flex justify-center py-20'>
        <Spinner label='Đang tải dữ liệu...' />
      </div>
    );
  }

  // --- Main Form ---
  return (
    <div className='max-w-3xl mx-auto p-6 border rounded-medium shadow-2xl shadow-blue-300/40 bg-foreground-50'>
      {' '}
      <Form
        className='space-y-6 '
        validationErrors={errors}
        onReset={() => {
          setQuestion({
            lessonId: selectedLesson ?? lessonIdFromRoute ?? undefined,
          });
          setSubmitted(null);
        }}
        // onSubmit={handleSubmit}
        onSubmit={(e) => {
          e.preventDefault();
          setShowConfirm(true);
        }}
      >
        {/* Nội dung câu hỏi */}
        <Textarea
          isRequired
          errorMessage={errors.content}
          isInvalid={!!errors.content}
          label='Nội dung câu hỏi'
          labelPlacement='outside'
          name='content'
          placeholder='Nhập nội dung câu hỏi'
          value={question.content ?? ''}
          onValueChange={(val) => setQuestion((q) => ({ ...q, content: val }))}
        />

        {/* Giải thích */}
        <Textarea
          label='Giải thích (tuỳ chọn)'
          labelPlacement='outside'
          name='explanation'
          placeholder='Giải thích cho câu hỏi (nếu có)'
          value={question.explanation ?? ''}
          onValueChange={(val) =>
            setQuestion((q) => ({ ...q, explanation: val }))
          }
        />

        {/* Mức độ khó */}
        <Select
          isRequired
          errorMessage={errors.levelId}
          isInvalid={!!errors.levelId}
          label='Mức độ'
          labelPlacement='outside'
          placeholder='Chọn mức độ câu hỏi'
          selectedKeys={question.levelId ? [String(question.levelId)] : []}
          onSelectionChange={(keys) => {
            const id = Number(Array.from(keys)[0]);

            setQuestion((q) => ({ ...q, levelId: id }));
          }}
        >
          {levels.map((level: LevelPayload) => (
            <SelectItem key={level.id}>{level.name}</SelectItem>
          ))}
        </Select>

        {/* Loại câu hỏi */}
        <Select
          isRequired
          errorMessage={errors.questionTypeId}
          isInvalid={!!errors.questionTypeId}
          label='Loại câu hỏi'
          labelPlacement='outside'
          placeholder='Chọn loại câu hỏi'
          selectedKeys={
            question.questionTypeId ? [String(question.questionTypeId)] : []
          }
          onSelectionChange={(keys) => {
            const id = Number(Array.from(keys)[0]);

            setQuestion((q) => ({ ...q, questionTypeId: id }));
          }}
        >
          {questionTypes.map((qt: QuestionTypePayload) => (
            <SelectItem key={qt.id}>{qt.name}</SelectItem>
          ))}
        </Select>

        {/* --- Options (Tối đa 4) --- */}
        <div className='w-full'>
          <p className='font-light mb-2 text-sm'>Các lựa chọn (tối đa 4)</p>
          {options.map((opt, index) => (
            <div
              key={index}
              className='flex items-center gap-2 mb-2 border p-2 rounded-md'
            >
              <Input
                className='flex-1'
                placeholder={`Lựa chọn ${index + 1}`}
                value={opt.content}
                onValueChange={(val) => updateOption(index, 'content', val)}
              />
              <Checkbox
                isSelected={opt.isCorrect}
                onValueChange={() => toggleCorrect(index)}
              >
                Đúng
              </Checkbox>
            </div>
          ))}
          {errors.options && (
            <p className='text-danger text-sm mt-1'>{errors.options}</p>
          )}
          {errors.correctAnswer && (
            <p className='text-danger text-sm mt-1'>{errors.correctAnswer}</p>
          )}
        </div>

        {/* Lesson hiển thị (read-only) */}

        {question.lessonId && (
          <Input
            isReadOnly
            label='Bài học'
            labelPlacement='outside'
            value={`Lesson ID: ${question.lessonId}`}
          />
        )}

        <Input
          isReadOnly
          label='Môn học'
          labelPlacement='outside'
          value={` ${subject?.name}`}
        />

        <Input
          isReadOnly
          label='Khối lớp'
          labelPlacement='outside'
          value={` ${grade?.name}`}
        />

        <Input
          isReadOnly
          label='Bài học'
          labelPlacement='outside'
          value={` ${chapter?.name}`}
        />

        <div className='flex gap-4 pt-4'>
          <Button
            color='primary'
            startContent={<Icon icon='lucide:save' />}
            type='submit'
          >
            Lưu câu hỏi
          </Button>
          <Button
            startContent={<Icon icon='lucide:rotate-ccw' />}
            type='reset'
            variant='bordered'
          >
            Reset
          </Button>
        </div>
      </Form>
      {submitted && (
        <div className='mt-6 text-sm text-default-600'>
          <h3 className='font-semibold'>Dữ liệu đã submit:</h3>
          <pre className='bg-default-50 p-3 rounded-md mt-2'>
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      )}
      <RecheckModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}
