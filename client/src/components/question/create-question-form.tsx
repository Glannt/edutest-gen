import type { QuestionPayload } from '@/types/question';

import React, { useRef, useState } from 'react';
import {
  Form,
  Input,
  Select,
  SelectItem,
  Button,
  Spinner,
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
import OptionInput, {
  OptionInputRef,
} from '@/components/question/option-input';

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

  // ✅ refs
  const contentRef = useRef<TestAreaRef>(null);
  const explanationRef = useRef<TestAreaRef>(null);
  const optionRefs = useRef<(OptionInputRef | null)[]>([]);

  const [options, setOptions] = useState<Partial<OptionPayload>[]>([
    {
      content: [{ type: 'text', value: '' }],
      isCorrect: false,
      orderIndex: 1,
    },
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
  const validate = (
    data: Partial<QuestionPayload>,
    latestOptions: Partial<OptionPayload>[]
  ) => {
    const newErrors: Record<string, string> = {};

    // 🧩 Kiểm tra nội dung chính
    if (
      !data.contentJson ||
      !Array.isArray(data.contentJson) ||
      data.contentJson.every(
        (b) =>
          (b.type === 'text' && !b.value?.trim()) ||
          (b.type === 'formula' && !b.latex?.trim())
      )
    ) {
      newErrors.contentJson = 'Nội dung câu hỏi là bắt buộc';
    }

    if (!data.lessonId) newErrors.lessonId = 'Bài học là bắt buộc';
    if (!data.levelId) newErrors.levelId = 'Mức độ là bắt buộc';
    if (!data.questionTypeId)
      newErrors.questionTypeId = 'Loại câu hỏi là bắt buộc';

    // ✅ Validate các lựa chọn dựa trên dữ liệu latestOptions
    const validOptions = (latestOptions ?? []).filter((o) => {
      if (!Array.isArray(o?.content)) return false;

      // ít nhất 1 block hợp lệ
      return o.content.some(
        (b) =>
          (b.type === 'text' && !!b.value?.trim()) ||
          (b.type === 'formula' && !!b.latex?.trim())
      );
    });

    console.log('✅ [validate] validOptions:', validOptions);

    if (validOptions.length < 1) {
      newErrors.options = 'Phải có ít nhất 1 lựa chọn hợp lệ';
    }

    // 🧩 Kiểm tra đáp án đúng
    const hasCorrect = (latestOptions ?? []).some((o) => o.isCorrect);

    if (!hasCorrect) {
      newErrors.correctAnswer = 'Phải chọn ít nhất 1 đáp án đúng';
    }

    return newErrors;
  };

  // --- Submit form ---
  const handleConfirmSubmit = async () => {
    console.log('%c[SUBMIT] 🔄 Starting validation...', 'color:#03a9f4');

    // 1️⃣ Gọi processText() cho toàn bộ input
    contentRef.current?.processText();
    explanationRef.current?.processText();
    optionRefs.current.forEach((ref) => ref?.processText());

    // 2️⃣ Thu thập latest data từ ref
    const latestOptions: Partial<OptionPayload>[] = options.map((opt, i) => {
      const ref = optionRefs.current[i];
      const latestContent = ref?.getContent?.() ?? opt.content ?? [];

      return {
        ...opt,
        content: latestContent,
        orderIndex: opt.orderIndex ?? i + 1,
      };
    });

    console.log('🧩 [Latest Options]', latestOptions);

    // 3️⃣ Validate
    const newErrors = validate(question, latestOptions);

    if (Object.keys(newErrors).length > 0) {
      console.warn('⚠️ Validation failed:', newErrors);
      setErrors(newErrors);
      setShowConfirm(false);

      return;
    }

    // 4️⃣ Tạo payload hợp lệ
    const payload: Partial<QuestionPayload> = {
      ...question,
      options: latestOptions.map((opt) => ({
        ...opt,
        questionId: question.id,
      })),
    };

    console.log('%c📦 Final Payload:', 'color:#4caf50', payload);

    // 5️⃣ Gửi request
    try {
      const res = await createQuestion(payload);

      addToast({
        title: 'Thành công',
        description: 'Câu hỏi đã được tạo thành công!',
        color: 'success',
        timeout: 1500,
      });
    } catch (err: any) {
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
      prev.map((opt, i) =>
        i === index
          ? { ...opt, [field]: value, orderIndex: opt.orderIndex ?? i + 1 }
          : opt
      )
    );
  };

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        content: [{ type: 'text', value: '' }],
        isCorrect: false,
        orderIndex: prev.length + 1,
      },
    ]);
  };

  const toggleCorrect = (index: number) => {
    setOptions((prev) =>
      prev.map((opt, i) => ({
        ...opt,
        isCorrect: i === index ? !opt.isCorrect : opt.isCorrect,
      }))
    );
  };

  // --- Loading ---
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
      <Form
        className='space-y-6'
        validationErrors={errors}
        onReset={() => {
          setQuestion({
            lessonId: selectedLesson ?? lessonIdFromRoute ?? undefined,
          });
          setSubmitted(null);
        }}
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
            <div>
              <p className='font-semibold mb-2 text-md '>Các lựa chọn</p>
              {options.map((opt, index) => (
                <OptionInput
                  key={index}
                  ref={(el) => (optionRefs.current[index] = el)}
                  defaultValue={opt.content}
                  isCorrect={opt.isCorrect ?? false}
                  label={`Lựa chọn ${index + 1}`}
                  onChange={(newBlocks) =>
                    updateOption(index, 'content', newBlocks)
                  }
                  onToggleCorrect={() => toggleCorrect(index)}
                />
              ))}
              <Button
                className='mt-2 w-full'
                size='sm'
                type='button'
                variant='shadow'
                onClick={addOption}
              >
                Thêm lựa chọn
              </Button>
              {errors.options && (
                <p className='text-danger text-sm mt-1'>{errors.options}</p>
              )}
              {errors.correctAnswer && (
                <p className='text-danger text-sm mt-1'>
                  {errors.correctAnswer}
                </p>
              )}
            </div>

            {/* Thông tin phụ */}
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

        {/* 🟨 Nút hành động */}
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

      <RecheckModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}
