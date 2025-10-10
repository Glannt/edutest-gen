import type { QuestionPayload } from '@/types/question';

import React, { useState } from 'react';
import {
  Form,
  Input,
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
import TestArea, { TestAreaRef } from '@/components/question/question-area';

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
    contentJson: [{ type: 'text', value: '' }],
    explanationJson: [{ type: 'text', value: '' }],
  });

  //ref
  const contentRef = React.useRef<TestAreaRef>(null);
  const explanationRef = React.useRef<TestAreaRef>(null);

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

    if (!data.contentJson || !data.contentJson[0]?.value?.trim()) {
      newErrors.contentJson = 'Nội dung câu hỏi là bắt buộc';
    }
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

  const handleConfirmSubmit = async () => {
    const newErrors = validate(question);

    contentRef.current?.processText();
    explanationRef.current?.processText();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowConfirm(false);

      return;
    }

    const payload: Partial<QuestionPayload> = {
      contentJson: question.contentJson!,
      explanationJson: question.explanationJson ?? [],
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
    <div className='max-w-7xl mx-auto p-6 border rounded-medium shadow-2xl shadow-blue-300/40 bg-foreground-50'>
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
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
          {/* 🟦 CỘT TRÁI */}
          <div className='flex flex-col gap-6'>
            <TestArea
              ref={contentRef}
              defaultBlocks={question.contentJson ?? []}
              label='Nội dung câu hỏi'
              placeholder='Nhập nội dung câu hỏi (có thể chứa công thức, ví dụ: $x^2 + y^2$)'
              onChange={(blocks) =>
                setQuestion((q) => ({ ...q, contentJson: blocks }))
              }
            />

            <TestArea
              ref={explanationRef}
              defaultBlocks={question.explanationJson ?? []}
              label='Giải thích (tuỳ chọn)'
              placeholder='Nhập phần giải thích, có thể chứa công thức...'
              onChange={(blocks) =>
                setQuestion((q) => ({ ...q, explanationJson: blocks }))
              }
            />

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
          </div>

          {/* 🟩 CỘT PHẢI */}
          <div className='flex flex-col gap-6'>
            {/* Options */}
            <div>
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
                <p className='text-danger text-sm mt-1'>
                  {errors.correctAnswer}
                </p>
              )}
            </div>

            {/* Các thông tin phụ */}
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
              label='Chương'
              labelPlacement='outside'
              value={` ${chapter?.name}`}
            />
          </div>
        </div>

        {/* 🟨 Nút hành động - căn giữa */}
        <div className='flex justify-center gap-4 pt-6 border-t mt-6 w-full'>
          <Button
            color='primary'
            size='lg'
            startContent={<Icon icon='lucide:save' />}
            type='submit'
          >
            Lưu câu hỏi
          </Button>
          <Button
            size='lg'
            startContent={<Icon icon='lucide:rotate-ccw' />}
            type='reset'
            variant='bordered'
          >
            Reset
          </Button>
        </div>
      </Form>
      {/* {submitted && (
        <div className='mt-6 text-sm text-default-600'>
          <h3 className='font-semibold'>Dữ liệu đã submit:</h3>
          <pre className='bg-default-50 p-3 rounded-md mt-2'>
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      )} */}
      <RecheckModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}
