import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { useGrades } from '@/hooks/useGrades';
import { useSubjects } from '@/hooks/useSubjects';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateQuestion: (gradeId: number, subjectId: number) => void;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
  onCreateQuestion,
}) => {
  const { data: grades, isLoading: gradesLoading } = useGrades();
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

  // Khi grades loaded, chọn mặc định phần tử đầu tiên
  useEffect(() => {
    if (grades && grades.length > 0 && selectedGrade === null) {
      setSelectedGrade(grades[0].id);
    }
  }, [grades, selectedGrade]);

  // Khi subjects loaded, chọn mặc định phần tử đầu tiên
  useEffect(() => {
    if (subjects && subjects.length > 0 && selectedSubject === null) {
      setSelectedSubject(subjects[0].id);
    }
  }, [subjects, selectedSubject]);

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior='inside'
      size='5xl'
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1 border-b border-divider'>
              <div className='flex items-center'>
                <Button
                  isIconOnly
                  className='mr-2'
                  variant='light'
                  onPress={onClose}
                >
                  <Icon icon='lucide:chevron-left' />
                </Button>
                <span>Quay lại</span>
              </div>
            </ModalHeader>

            <ModalBody className='py-6'>
              <div className='space-y-8'>
                {/* Grade Blocks */}
                <div>
                  <h3 className='text-lg font-medium mb-4'>Khối học</h3>
                  {gradesLoading ? (
                    <Spinner label='Đang tải khối học...' />
                  ) : (
                    <div className='flex flex-wrap gap-2'>
                      {grades?.map((grade) => (
                        <Button
                          key={grade.id}
                          className={`border border-default-200 ${
                            selectedGrade === grade.id
                              ? 'bg-primary text-white'
                              : 'bg-default-50'
                          }`}
                          radius='sm'
                          variant='bordered'
                          onPress={() => setSelectedGrade(grade.id)}
                        >
                          {grade.name || `Khối ${grade.level}`}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subjects */}
                <div>
                  <h3 className='text-lg font-medium mb-4'>Môn học</h3>
                  {subjectsLoading ? (
                    <Spinner label='Đang tải môn học...' />
                  ) : (
                    <div className='flex flex-wrap gap-2'>
                      {subjects?.map((subject) => (
                        <Button
                          key={subject.id}
                          className={`border border-default-200 ${
                            selectedSubject === subject.id
                              ? 'bg-primary text-white'
                              : 'bg-default-50'
                          }`}
                          radius='sm'
                          variant='bordered'
                          onPress={() => setSelectedSubject(subject.id)}
                        >
                          {subject.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Button tạo câu hỏi */}
                <div>
                  <Button
                    color='primary'
                    startContent={<Icon icon='lucide:plus' />}
                    variant='solid'
                    onPress={() => {
                      if (selectedGrade && selectedSubject) {
                        onCreateQuestion(selectedGrade, selectedSubject);
                      }
                    }}
                  >
                    Tạo câu hỏi mới
                  </Button>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
