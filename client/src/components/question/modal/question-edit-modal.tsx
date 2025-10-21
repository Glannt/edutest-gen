import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  addToast,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { ContentBlockPayload, QuestionPayload } from '@/types/question';
import { OptionPayload } from '@/types/option';
import OptionInput, {
  OptionInputRef,
} from '@/components/question/option-input';
import { useUpdateQuestion } from '@/hooks/useQuestion';
import { useLevels } from '@/hooks/useLevels';
import { useQuestionTypes } from '@/hooks/useQuestionTypes';

interface QuestionEditModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  question: QuestionPayload | null;
  onSave: () => void;
  lessonId: number | null;
}

export const QuestionEditModal: React.FC<QuestionEditModalProps> = ({
  isOpen,
  onOpenChange,
  question,
  onSave,
  lessonId,
}) => {
  const [formData, setFormData] = useState<Partial<QuestionPayload> | null>(
    null
  );
  const optionRefs = useRef<(OptionInputRef | null)[]>([]);

  const updateMutation = useUpdateQuestion();
  const { data: levels = [] } = useLevels();
  const { data: questionTypes = [] } = useQuestionTypes();

  // Load question vào form khi mở modal
  useEffect(() => {
    if (question) {
      setFormData({
        ...question,
        lessonId: lessonId ?? undefined,
        levelId: question.level?.id ?? undefined,
        questionTypeId: question.questionType?.id ?? undefined,
        options:
          question.options && question.options.length > 0
            ? JSON.parse(JSON.stringify(question.options))
            : [
                {
                  content: [{ type: 'text', value: '' }],
                  isCorrect: false,
                  orderIndex: 1,
                },
              ],
      });
    }
  }, [question]);

  if (!formData) return null;

  // --- Option handlers ---
  const handleOptionChange = (index: number, blocks: ContentBlockPayload[]) => {
    setFormData((prev) => ({
      ...prev!,
      options: prev!.options!.map((o, i) =>
        i === index ? { ...o, content: blocks } : o
      ),
    }));
  };

  const handleToggleCorrect = (index: number) => {
    setFormData((prev) => ({
      ...prev!,
      options: prev!.options!.map((o, i) => ({
        ...o,
        isCorrect: i === index ? !o.isCorrect : o.isCorrect,
      })),
    }));
  };

  const addOption = () => {
    const newOption: Partial<OptionPayload> = {
      id: Date.now(),
      content: [{ type: 'text', value: '' }],
      isCorrect: false,
      orderIndex: formData.options!.length + 1,
    };

    setFormData((prev) => {
      const newOptions = [...prev!.options!, newOption];

      optionRefs.current = newOptions.map(
        (_, i) => optionRefs.current[i] ?? null
      );

      return { ...prev!, options: newOptions };
    });
  };

  // --- Validation ---
  const validate = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.lessonId) errors.lessonId = 'Lesson ID is required';
    if (!formData.levelId) errors.levelId = 'Level is required';
    if (!formData.questionTypeId)
      errors.questionTypeId = 'Question Type is required';

    const validOptions = formData.options?.filter((o) =>
      o.content?.some(
        (b) =>
          (b.type === 'text' && !!b.value?.trim()) ||
          (b.type === 'formula' && !!b.latex?.trim())
      )
    );

    if (!validOptions || validOptions.length < 1)
      errors.options = 'At least one valid option is required';
    if (!formData.options?.some((o) => o.isCorrect))
      errors.correctAnswer = 'At least one correct answer is required';

    return errors;
  };

  // --- Save ---
  const handleSave = () => {
    optionRefs.current.forEach((ref) => ref?.processText());
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((msg) =>
        addToast({ title: msg, color: 'danger', timeout: 2000 })
      );

      return;
    }

    const payload: Partial<QuestionPayload> = {
      ...formData,
      options: formData.options!.map((o, i) => ({
        ...o,
        content: optionRefs.current[i]?.getContent() ?? o.content,
      })),
    };

    updateMutation.mutate(
      { id: question!.id, payload },
      {
        onSuccess: () => {
          onSave();
          onOpenChange(false);
          addToast({
            title: 'Cập nhật câu hỏi thành công',
            color: 'success',
            timeout: 2000,
          });
        },
        onError: () => {
          addToast({
            title: 'Cập nhật câu hỏi thất bại',
            color: 'danger',
            timeout: 2000,
          });
        },
      }
    );
  };

  return (
    <Modal
      className='h-full'
      isOpen={isOpen}
      scrollBehavior='inside'
      size='5xl'
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader>Chỉnh sửa câu hỏi</ModalHeader>
        <ModalBody className='space-y-4'>
          {/* Level */}
          <Select
            label='Mức độ'
            selectedKeys={formData.levelId ? [String(formData.levelId)] : []}
            onSelectionChange={(keys) =>
              setFormData((prev) => ({
                ...prev!,
                levelId: Number(Array.from(keys)[0]),
              }))
            }
          >
            {levels.map((l) => (
              <SelectItem key={l.id}>{l.name}</SelectItem>
            ))}
          </Select>

          {/* Question Type */}
          <Select
            label='Loại câu hỏi'
            selectedKeys={
              formData.questionTypeId ? [String(formData.questionTypeId)] : []
            }
            onSelectionChange={(keys) =>
              setFormData((prev) => ({
                ...prev!,
                questionTypeId: Number(Array.from(keys)[0]),
              }))
            }
          >
            {questionTypes.map((qt) => (
              <SelectItem key={qt.id}>{qt.name}</SelectItem>
            ))}
          </Select>

          {/* Nút thêm option */}
          {/* <Button
            color='secondary'
            startContent={<Icon icon='lucide:plus' />}
            variant='light'
            onPress={addOption}
          >
            Thêm lựa chọn
          </Button> */}

          {/* OptionInput horizontal layout */}
          <div className='w-full'>
            <div className='mb-3'>
              <Button
                className='flex-shrink-0 w-full'
                color='secondary'
                startContent={<Icon icon='lucide:plus' />}
                variant='shadow'
                onPress={addOption}
              >
                Thêm lựa chọn
              </Button>
            </div>

            <div className='flex flex-wrap justify-around gap-4'>
              {formData.options!.map((option, idx) => (
                <div
                  key={option.id ?? idx}
                  className='w-fit'
                >
                  <OptionInput
                    ref={(el) => (optionRefs.current[idx] = el)}
                    className='flex-2'
                    defaultValue={
                      option.content ?? [{ type: 'text', value: '' }]
                    }
                    isCorrect={option.isCorrect ?? false}
                    label={`Lựa chọn ${String.fromCharCode(65 + idx)}`}
                    onChange={(blocks) => handleOptionChange(idx, blocks)}
                    onToggleCorrect={() => handleToggleCorrect(idx)}
                  />
                </div>
              ))}
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color='default'
            variant='flat'
            onPress={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            color='primary'
            isLoading={updateMutation.isPending}
            startContent={
              !updateMutation.isPending && <Icon icon='lucide:save' />
            }
            onPress={handleSave}
          >
            Lưu thay đổi
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
