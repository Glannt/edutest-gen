import { Button } from '@heroui/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Textarea } from '@heroui/input';

import FormulaEditor from '@/components/question/formula/formula-editor';
import { ContentBlockPayload } from '@/types/question';

export interface TestAreaRef {
  processText: () => void;
}

interface TestAreaProps {
  label: string;
  placeholder?: string;
  onChange: (blocks: ContentBlockPayload[]) => void;
  defaultBlocks?: ContentBlockPayload[];
}

const TestArea = forwardRef<TestAreaRef, TestAreaProps>(
  ({ label, placeholder, onChange, defaultBlocks = [] }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formula, setFormula] = useState('');
    const [mainText, setMainText] = useState('');
    const [contentBlocks, setContentBlocks] =
      useState<ContentBlockPayload[]>(defaultBlocks);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleInsertFormula = () => {
      if (formula.trim()) {
        setMainText((prev) => prev + ` $${formula}$ `);
        setFormula('');
      }
      setIsOpen(false);
    };

    const handleProcessText = useCallback(() => {
      if (!mainText.trim()) return;

      const parts = mainText.split(/(\$.*?\$)/g).filter(Boolean);
      const newBlocks: ContentBlockPayload[] = [];

      parts.forEach((part) => {
        const trimmed = part.trim();

        if (trimmed.startsWith('$') && trimmed.endsWith('$')) {
          const latex = trimmed.slice(1, -1);

          newBlocks.push({ type: 'formula', latex });
        } else if (trimmed) {
          newBlocks.push({ type: 'text', value: trimmed });
        }
      });

      setContentBlocks(newBlocks);
      onChange(newBlocks);
    }, [mainText, onChange]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        handleProcessText();
      }, 800);

      return () => clearTimeout(timeout);
    }, [mainText, handleProcessText]);

    useImperativeHandle(ref, () => ({
      processText: handleProcessText,
    }));

    return (
      <div className='p-3 border rounded-md bg-default-50 w-full'>
        <label className='font-medium text-sm mb-2 block'>{label}</label>
        <Textarea
          minRows={5}
          placeholder={placeholder}
          value={mainText}
          onValueChange={setMainText}
        />
        <div className='flex justify-end gap-2 mt-2'>
          <Button
            color='primary'
            onPress={handleOpen}
          >
            Chèn công thức
          </Button>
        </div>

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

// ✅ Thêm dòng này để fix ESLint
TestArea.displayName = 'TestArea';

export default TestArea;
