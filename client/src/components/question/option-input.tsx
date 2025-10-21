import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Button } from '@heroui/button';
import { Checkbox } from '@heroui/checkbox';
import { Textarea } from '@heroui/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import katex from 'katex';
import 'katex/dist/katex.min.css';

import FormulaEditor from '@/components/question/formula/formula-editor';
import { ContentBlockPayload } from '@/types/question';

export interface OptionInputRef {
  processText: () => void;
  getContent: () => ContentBlockPayload[];
}

interface OptionInputProps {
  label: string;
  defaultValue?: ContentBlockPayload[];
  isCorrect: boolean;
  onChange: (blocks: ContentBlockPayload[]) => void;
  onToggleCorrect: () => void;
  className?: string;
}

const OptionInput = forwardRef<OptionInputRef, OptionInputProps>(
  (
    {
      label,
      defaultValue = [{ type: 'text', value: '' }],
      isCorrect,
      onChange,
      onToggleCorrect,
      className = '',
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formula, setFormula] = useState('');
    const [mainText, setMainText] = useState('');
    const [contentBlocks, setContentBlocks] =
      useState<ContentBlockPayload[]>(defaultValue);

    // 🔁 Ref để luôn giữ giá trị mới nhất
    const blocksRef = useRef<ContentBlockPayload[]>(defaultValue);

    // Mỗi khi contentBlocks thay đổi => cập nhật ref
    useEffect(() => {
      blocksRef.current = contentBlocks;
    }, [contentBlocks]);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    /** ✅ Chèn công thức vào text */
    const handleInsertFormula = () => {
      if (formula.trim()) {
        setMainText((prev) => prev + ` $${formula}$ `);
        setFormula('');
      }
      setIsOpen(false);
    };

    /** ✅ Chuyển text → ContentBlockPayload[] */
    const handleProcessText = useCallback(() => {
      if (!mainText.trim()) {
        onChange([]);
        setContentBlocks([]);
        blocksRef.current = [];

        return;
      }

      const parts = mainText.split(/(\$.*?\$)/g).filter(Boolean);
      const newBlocks: ContentBlockPayload[] = [];

      parts.forEach((part) => {
        const trimmed = part.trim();

        if (trimmed.startsWith('$') && trimmed.endsWith('$')) {
          newBlocks.push({ type: 'formula', latex: trimmed.slice(1, -1) });
        } else if (trimmed) {
          newBlocks.push({ type: 'text', value: trimmed });
        }
      });

      // ✅ Cập nhật state + ref đồng thời
      setContentBlocks(newBlocks);
      blocksRef.current = newBlocks;
      onChange(newBlocks);

      console.log('✅ Parsed newBlocks:', newBlocks);
    }, [mainText, onChange]);

    /** ✅ Khi defaultValue thay đổi → đồng bộ vào textarea */
    useEffect(() => {
      const newText = defaultValue
        .map((block) =>
          block.type === 'formula'
            ? `$${block.latex ?? ''}$`
            : (block.value ?? '')
        )
        .join(' ');

      setMainText(newText);
      setContentBlocks(defaultValue);
      blocksRef.current = defaultValue;
    }, [defaultValue]);

    /** ✅ Expose ref ra ngoài */
    useImperativeHandle(ref, () => ({
      processText: handleProcessText,
      getContent: () => blocksRef.current,
    }));

    return (
      <div className={`border p-2 rounded-md mb-2 ${className}`}>
        <div className='flex items-center gap-2 mb-2'>
          <Textarea
            className='flex-1'
            minRows={2}
            placeholder={label}
            value={mainText}
            onValueChange={setMainText}
          />
          <Button
            color='primary'
            onPress={handleOpen}
          >
            Chèn công thức
          </Button>
          <Checkbox
            isSelected={isCorrect}
            onValueChange={onToggleCorrect}
          >
            Đúng
          </Checkbox>
        </div>

        {/* ✅ Preview */}
        <div className='bg-gray-900 rounded-md p-2 min-h-10 text-base'>
          {contentBlocks.length === 0 ? (
            <span className='text-gray-500 italic'>Xem trước...</span>
          ) : (
            <div className='flex flex-wrap items-center gap-1'>
              {contentBlocks.map((block, idx) =>
                block.type === 'formula' ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: katex.renderToString(block.latex || '', {
                        throwOnError: false,
                        displayMode: false,
                      }),
                    }}
                    key={idx}
                    className='px-1'
                  />
                ) : (
                  <span key={idx}>{block.value}</span>
                )
              )}
            </div>
          )}
        </div>

        {/* ✅ Modal chèn công thức */}
        <Modal
          isOpen={isOpen}
          size='3xl'
          onClose={handleClose}
        >
          <ModalContent>
            <ModalHeader>Soạn công thức</ModalHeader>
            <ModalBody>
              <FormulaEditor
                formula={formula}
                setFormula={setFormula}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color='danger'
                variant='light'
                onPress={handleClose}
              >
                Hủy
              </Button>
              <Button
                color='primary'
                onPress={handleInsertFormula}
              >
                Chèn
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  }
);

OptionInput.displayName = 'OptionInput';
export default OptionInput;
