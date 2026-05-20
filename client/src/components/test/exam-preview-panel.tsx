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
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

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

  const handlePrint = () => {
    window.print();
  };

  // Paginate questions: Page 1 holds up to 5 questions; subsequent pages hold 6 questions each.
  const questions = exam.questions || [];
  const pages: { pageNum: number; questions: ExamQuestionRequest[]; startIdx: number }[] = [];

  if (questions.length === 0) {
    pages.push({ pageNum: 1, questions: [], startIdx: 0 });
  } else {
    // Page 1
    const page1Qs = questions.slice(0, 5);
    pages.push({ pageNum: 1, questions: page1Qs, startIdx: 0 });

    // Page 2 onwards
    let currentIdx = 5;
    let pageCount = 2;
    while (currentIdx < questions.length) {
      const pageQs = questions.slice(currentIdx, currentIdx + 6);
      pages.push({ pageNum: pageCount, questions: pageQs, startIdx: currentIdx });
      currentIdx += 6;
      pageCount++;
    }
  }

  return (
    <div className='flex flex-col w-full'>
      {/* Styles for A4 Mockup & Print styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .a4-preview-container {
          max-height: 850px;
          overflow-y: auto;
          background-color: #f3f4f6;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
          display: flex;
          flex-col: column;
          align-items: center;
          gap: 24px;
        }
        
        .a4-page {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          background: white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          position: relative;
          font-family: 'Times New Roman', Times, serif;
          color: black;
          box-sizing: border-box;
          text-align: left;
        }

        .a4-page * {
          font-family: 'Times New Roman', Times, serif !important;
        }

        .exam-header-box {
          border: 1.5px solid black;
          padding: 4px 12px;
          display: inline-block;
          font-weight: bold;
          font-size: 14px;
          margin-top: 8px;
        }

        @media print {
          /* Hide everything except the print area */
          body * {
            visibility: hidden;
          }
          .a4-print-area, .a4-print-area * {
            visibility: visible;
          }
          .a4-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            margin: 0;
            padding: 0;
          }
          .a4-page {
            box-shadow: none !important;
            margin: 0 !important;
            page-break-after: always;
            border: none !important;
          }
          .a4-preview-container {
            max-height: none !important;
            overflow: visible !important;
            padding: 0 !important;
            background: none !important;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      <div className='flex justify-between items-center mb-4 no-print'>
        <h3 className='font-semibold text-lg flex items-center gap-2'>
          👁️ Xem trước đề thi dạng in (A4)
        </h3>
        <Button
          color='secondary'
          variant='flat'
          startContent={<Icon icon='lucide:printer' />}
          onPress={handlePrint}
          className='font-medium'
        >
          In đề thi ngay
        </Button>
      </div>

      <div className='a4-preview-container a4-print-area w-full overflow-x-auto'>
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleQuestionDragEnd}
        >
          {pages.map((page) => (
            <div
              key={page.pageNum}
              className='a4-page border border-gray-300 relative flex flex-col justify-between mb-6'
            >
              <div>
                {/* Header Section */}
                {page.pageNum === 1 ? (
                  /* Page 1: Large Dual-Column School Header */
                  <div>
                    <div className='grid grid-cols-2 text-center items-start mb-6'>
                      <div className='flex flex-col items-center'>
                        <span className='text-sm uppercase tracking-wide'>UBND THÀNH PHỐ VŨNG TÀU</span>
                        <span className='text-sm font-bold uppercase'>TRƯỜNG THCS NGUYỄN GIA THIỀU</span>
                        <div className='exam-header-box'>
                          Đề {exam.code || '001'}
                        </div>
                      </div>
                      <div className='flex flex-col items-center'>
                        <span className='text-base font-bold uppercase tracking-wide'>
                          {exam.name ? exam.name.toUpperCase() : 'ĐỀ KIỂM TRA GIỮA HỌC KỲ I'}
                        </span>
                        <span className='text-sm font-bold mt-1'>
                          MÔN: TOÁN - LỚP 7 (NĂM HỌC 2025 - 2026)
                        </span>
                        <span className='text-sm mt-1'>
                          Thời gian làm bài: 90 phút
                        </span>
                        <span className='text-xs italic mt-0.5'>
                          (không kể thời gian phát đề)
                        </span>
                      </div>
                    </div>
                    <div className='border-t border-black my-4'></div>
                    <div className='font-bold text-sm mb-4 italic'>
                      Phần 1: Trắc nghiệm (10 điểm) - Chọn đáp án đúng trong các đáp án sau:
                    </div>
                  </div>
                ) : (
                  /* Page 2+: Clean Small Header with Exam Code only */
                  <div className='flex justify-between items-center mb-6 border-b border-gray-200 pb-2 text-xs'>
                    <span className='italic text-gray-500'>Đề thi: {exam.name || 'Khảo sát'}</span>
                    <span className='font-bold'>Mã đề: {exam.code || '001'}</span>
                  </div>
                )}

                {/* Questions List inside this Page */}
                {page.questions.length === 0 ? (
                  <div className='text-gray-400 italic text-center py-20'>
                    Chưa có câu hỏi nào trong đề thi này. Hãy thêm câu hỏi từ bảng ma trận hoặc ngân hàng câu hỏi.
                  </div>
                ) : (
                  <SortableContext
                    items={page.questions.map((q) => q.questionId.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className='flex flex-col gap-4'>
                      {page.questions.map((q, idx) => (
                        <SortableQuestion
                          key={q.questionId}
                          index={page.startIdx + idx + 1}
                          question={q}
                          onOptionChange={(updatedOptions) =>
                            handleOptionChange(q.questionId, updatedOptions)
                          }
                        />
                      ))}
                    </div>
                  </SortableContext>
                )}
              </div>

              {/* Footer Section: Page Number */}
              <div className='text-right text-xs mt-8 pt-2 border-t border-gray-100 font-serif'>
                Trang {page.pageNum}
              </div>
            </div>
          ))}
        </DndContext>
      </div>
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
      <div className='p-3 border border-dashed rounded bg-gray-50 text-xs italic text-gray-400'>
        Đang tải câu hỏi...
      </div>
    );
  if (error || !data)
    return (
      <div className='p-3 border border-red-200 rounded bg-red-50 text-xs text-red-500'>
        Lỗi tải câu hỏi #{question.questionId}
      </div>
    );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='group relative border border-transparent hover:border-blue-300 hover:bg-blue-50/20 rounded-md p-2 transition-all cursor-default'
    >
      {/* Drag handle visible on hover */}
      <div
        {...attributes}
        {...listeners}
        className='absolute -left-5 top-2 opacity-0 group-hover:opacity-100 cursor-grab p-1 bg-white border shadow-sm rounded text-gray-400 text-xs transition-opacity no-print select-none'
        title='Kéo để đổi thứ tự câu hỏi'
      >
        ⇅
      </div>

      <div className='text-sm leading-relaxed mb-2 font-serif'>
        <span className='font-bold'>Câu {index}: </span>
        {renderBlocks(data.contentJson || [])}
        <span className='text-xs text-gray-500 font-sans ml-1 no-print'>
          ({question.finalPoints ?? 0}đ)
        </span>
      </div>

      {data.options?.length ? (
        <OptionGrid
          options={
            data.options?.filter((o): o is OptionPayload => !!o.id) || []
          }
          onChange={onOptionChange}
        />
      ) : (
        <div className='text-gray-400 italic text-xs ml-6'>Chưa có lựa chọn đáp án</div>
      )}

      {/* Explanation in small italic text */}
      {data.explanationJson && data.explanationJson.length > 0 && (
        <div className='text-xs italic text-gray-500 mt-2 ml-6 pl-2 border-l border-gray-300 font-serif leading-relaxed'>
          Giải thích: {renderBlocks(data.explanationJson)}
        </div>
      )}
    </div>
  );
}

function OptionGrid({
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

  const renderBlocks = (blocks: ContentBlockPayload[]) =>
    blocks.map((b, i) => {
      if (b.type === 'text') return <span key={i}>{b.value} </span>;
      if (b.type === 'formula')
        return <InlineMath key={i}>{b.latex}</InlineMath>;

      return null;
    });

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
        {/* Render options side-by-side inside a 4-column grid matching actual printed paper format! */}
        <div className='grid grid-cols-4 gap-4 ml-6 my-2'>
          {localOptions.map((o, idx) => {
            const label = String.fromCharCode(65 + idx);
            return (
              <div
                key={o.id}
                className={`flex items-start gap-1.5 text-sm font-serif p-1.5 rounded transition-colors ${o.isCorrect ? 'bg-green-50/60 font-semibold text-green-700' : 'text-black'}`}
              >
                <span className='font-bold'>{label}.</span>
                <span className='leading-tight'>{renderBlocks(o.content || [])}</span>
              </div>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
