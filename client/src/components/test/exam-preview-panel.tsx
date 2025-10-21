import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardBody } from '@heroui/react';
import { InlineMath } from 'react-katex';

import { CreateExamRequest, ExamQuestionRequest } from '@/types/exam';
import { OptionPayload } from '@/types/option';
import { useQuestion } from '@/hooks/useQuestion';
import { ContentBlockPayload } from '@/types/question';

interface ExamPreviewPanelProps {
  exam: CreateExamRequest;
  onExamChange: (updatedExam: CreateExamRequest) => void;
}

export const ExamPreviewPanel: React.FC<ExamPreviewPanelProps> = ({
  exam,
  onExamChange,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleQuestionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over || active.id === over.id) return;

    const oldIndex =
      exam.questions?.findIndex((q) => q.questionId === Number(active.id)) ??
      -1;

    const newIndex =
      exam.questions?.findIndex((q) => q.questionId === Number(over.id)) ?? -1;

    if (oldIndex === -1 || newIndex === -1) return;

    const newQuestions = arrayMove(exam.questions!, oldIndex, newIndex);

    onExamChange({ ...exam, questions: newQuestions });
  };

  const handleOptionChange = (
    questionId: number,
    updatedOptions: OptionPayload[]
  ) => {
    const questions = exam.questions || [];
    const newQuestions = questions.map((q) =>
      q.questionId === questionId ? { ...q, options: updatedOptions } : q
    );

    onExamChange({ ...exam, questions: newQuestions });
  };

  return (
    <div>
      <h3 className='font-semibold text-lg mb-4'>
        🧩 Xem trước đề thi: {exam.name} {exam.code && `(Mã: ${exam.code})`}
      </h3>

      {!exam.questions?.length ? (
        <p className='text-gray-500 italic'>Chưa có câu hỏi nào.</p>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleQuestionDragEnd}
        >
          <SortableContext
            items={exam.questions.map((q) => q.questionId.toString())}
            strategy={verticalListSortingStrategy}
          >
            {exam.questions.map((q, idx) => (
              <SortableQuestion
                key={q.questionId}
                index={idx + 1}
                question={q}
                onOptionChange={(updatedOptions) =>
                  handleOptionChange(q.questionId, updatedOptions)
                }
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

interface SortableQuestionProps {
  question: ExamQuestionRequest;
  index: number;
  onOptionChange: (updatedOptions: OptionPayload[]) => void;
}

function SortableQuestion({
  question,
  index,
  onOptionChange,
}: SortableQuestionProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: question.questionId.toString(),
    });

  const { data, isLoading, error } = useQuestion(question.questionId);

  const style = { transform: CSS.Transform.toString(transform), transition };

  const renderBlocks = (blocks: ContentBlockPayload[]) =>
    blocks.map((b, i) => {
      if (b.type === 'text') return <span key={i}>{b.value} </span>;
      if (b.type === 'formula')
        return <InlineMath key={i}>{b.latex}</InlineMath>;

      return null;
    });

  if (isLoading)
    return (
      <Card className='mb-6 p-4'>
        <CardBody>Đang tải...</CardBody>
      </Card>
    );
  if (error || !data)
    return (
      <Card className='mb-6 p-4'>
        <CardBody>Lỗi tải câu hỏi #{question.questionId}</CardBody>
      </Card>
    );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='mb-6 p-4 border bg-white'
    >
      <CardBody>
        <div className='flex justify-between mb-2'>
          <div className='font-semibold'>
            Câu {index}: {question.finalPoints ?? 0} điểm
          </div>
          <span className='cursor-grab select-none'>⇅</span>
        </div>

        <div className='mb-3 leading-relaxed'>
          {renderBlocks(data.contentJson || [])}
        </div>

        {data.options?.length ? (
          <OptionList
            options={
              data.options?.filter((o): o is OptionPayload => !!o.id) || []
            }
            onChange={onOptionChange}
          />
        ) : (
          <div className='text-gray-400 italic text-sm'>Chưa có lựa chọn</div>
        )}
      </CardBody>
    </Card>
  );
}

function OptionList({
  options,
  onChange,
}: {
  options: OptionPayload[];
  onChange: (updated: OptionPayload[]) => void;
}) {
  const [localOptions, setLocalOptions] = useState<OptionPayload[]>(options);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => setLocalOptions(options), [options]);

  const handleOptionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = localOptions.findIndex((o) => o.id === Number(active.id));
    const newIndex = localOptions.findIndex((o) => o.id === Number(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const newOpts = arrayMove(localOptions, oldIndex, newIndex).map(
      (o, idx) => ({
        ...o,
        orderIndex: idx + 1,
      })
    );

    setLocalOptions(newOpts);
    onChange(newOpts);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={handleOptionDragEnd}
    >
      <SortableContext
        items={localOptions.map((o) => o.id.toString())}
        strategy={verticalListSortingStrategy}
      >
        {localOptions.map((o, idx) => (
          <SortableOption
            key={o.id}
            label={String.fromCharCode(65 + idx)}
            option={o}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortableOption({
  option,
  label,
}: {
  option: OptionPayload;
  label: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: option.id.toString(),
    });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const renderBlocks = (blocks: ContentBlockPayload[]) =>
    blocks.map((b, i) => {
      if (b.type === 'text') return <span key={i}>{b.value} </span>;
      if (b.type === 'formula')
        return <InlineMath key={i}>{b.latex}</InlineMath>;

      return null;
    });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex items-start gap-2 border rounded p-2 mb-2 cursor-grab ${option.isCorrect ? 'bg-green-50 border-green-400' : 'bg-white border-gray-200'}`}
      style={style}
    >
      <div className='font-semibold w-6 text-center'>{label}.</div>
      <div>{renderBlocks(option.content || [])}</div>
    </div>
  );
}
