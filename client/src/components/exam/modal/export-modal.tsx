import { Button } from '@heroui/button';
import { Checkbox, CheckboxGroup } from '@heroui/checkbox';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { Switch } from '@heroui/switch';
import React from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  exams: any[];
  multipleFiles: boolean;
  setMultipleFiles: (value: boolean) => void;
  selectedExams: string[];
  setSelectedExams: (value: string[]) => void;
  singleExamId: string;
  setSingleExamId: (value: string) => void;
  handleExport: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onOpenChange,
  exams,
  multipleFiles,
  setMultipleFiles,
  selectedExams,
  setSelectedExams,
  singleExamId,
  setSingleExamId,
  handleExport,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          Xuất file đề thi
        </ModalHeader>
        <ModalBody>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <Switch
                isSelected={multipleFiles}
                onValueChange={setMultipleFiles}
              />
              <span>Xuất nhiều file</span>
            </div>
            <span className='text-default-500 text-sm'>
              {multipleFiles ? 'Chọn nhiều đề thi' : 'Chọn một đề thi'}
            </span>
          </div>

          {multipleFiles ? (
            <CheckboxGroup
              className='gap-2'
              label='Chọn các đề thi cần xuất'
              value={selectedExams}
              onValueChange={setSelectedExams}
            >
              {exams.map((exam) => (
                <Checkbox
                  key={exam.id}
                  value={exam.id.toString()}
                >
                  {exam.name} ({exam.code})
                </Checkbox>
              ))}
            </CheckboxGroup>
          ) : (
            <div className='flex flex-col gap-2'>
              <p className='text-sm mb-2'>Chọn một đề thi để xuất:</p>
              {exams.map((exam) => (
                <Checkbox
                  key={exam.id}
                  isSelected={singleExamId === exam.id.toString()}
                  onValueChange={(isSelected) => {
                    if (isSelected) {
                      setSingleExamId(exam.id.toString());
                    } else if (singleExamId === exam.id.toString()) {
                      setSingleExamId('');
                    }
                  }}
                >
                  {exam.name} ({exam.code})
                </Checkbox>
              ))}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            color='danger'
            variant='light'
            onPress={onOpenChange}
          >
            Hủy
          </Button>
          <Button
            color='primary'
            isDisabled={
              (multipleFiles && selectedExams.length === 0) ||
              (!multipleFiles && !singleExamId)
            }
            onPress={handleExport}
          >
            Xuất file
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
