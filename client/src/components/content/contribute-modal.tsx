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
import { useNavigate } from 'react-router-dom';

import { useGrades } from '@/hooks/useGrades';
import { useSubjects } from '@/hooks/useSubjects';
import { useChaptersByGradeAndSubject } from '@/hooks/useGradeSubject';
import { useLessonsByChapter } from '@/hooks/useLesson';
import { LessonPayload } from '@/types/lesson';
import { ChapterPayload } from '@/service/grade-subject.service';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  showLessonSelect: boolean;
  onCreateQuestion?: () => void | undefined;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
  showLessonSelect,
  onCreateQuestion,
}) => {
  const navigate = useNavigate();
  const { data: grades, isLoading: gradesLoading } = useGrades();
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const { data: chapters } = useChaptersByGradeAndSubject(
    selectedGrade || undefined,
    selectedSubject || undefined
  );
  const { data: lessons } = useLessonsByChapter(selectedChapter || undefined);

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

  const handleCreateQuestion = () => {
    if (selectedGrade && selectedSubject && selectedChapter && selectedLesson) {
      navigate(
        `/dashboard/question/create?gradeId=${selectedGrade}&subjectId=${selectedSubject}&chapterId=${selectedChapter}&lessonId=${selectedLesson}`
      );
      onClose(); // đóng modal sau khi chuyển trang
    } else {
      console.warn('Missing selection');
    }
  };

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

                {/* Chapter selection */}
                {showLessonSelect ? (
                  <>
                    <div>
                      <p className='mb-2 font-medium'>Chọn chương</p>
                      <div className='flex flex-wrap gap-2'>
                        {chapters?.map((c: ChapterPayload) => (
                          <Button
                            key={c.id}
                            className={`border border-default-200 ${
                              selectedChapter === c.id
                                ? 'bg-primary text-white'
                                : 'bg-default-50'
                            }`}
                            radius='sm'
                            variant='bordered'
                            onPress={() => setSelectedChapter(c.id)}
                          >
                            {c.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Lesson selection */}
                    {selectedChapter && (
                      <div>
                        <p className='mb-2 font-medium'>Chọn bài học</p>
                        <div className='flex flex-wrap gap-2'>
                          {lessons?.map((l: LessonPayload) => (
                            <Button
                              key={l.id}
                              className={`border border-default-200 ${
                                selectedLesson === l.id
                                  ? 'bg-primary text-white'
                                  : 'bg-default-50'
                              }`}
                              radius='sm'
                              variant='bordered'
                              onPress={() => setSelectedLesson(l.id)}
                            >
                              {l.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Button tạo câu hỏi */}
                    <div>
                      <Button
                        color='primary'
                        startContent={<Icon icon='lucide:plus' />}
                        variant='solid'
                        // onPress={() => {
                        //   if (
                        //     selectedGrade &&
                        //     selectedSubject &&
                        //     selectedChapter &&
                        //     selectedLesson
                        //   ) {
                        //     // onCreateQuestion() => {};
                        //   }
                        // }}
                        onPress={handleCreateQuestion}
                      >
                        Tạo câu hỏi mới
                      </Button>
                    </div>
                  </>
                ) : (
                  <div>
                    <Button
                      color='primary'
                      startContent={<Icon icon='lucide:plus' />}
                      variant='solid'
                      onPress={() => {
                        if (
                          selectedGrade &&
                          selectedSubject &&
                          selectedChapter &&
                          selectedLesson
                        ) {
                          onCreateQuestion;
                        }
                      }}
                    >
                      Tạo câu hỏi mới
                    </Button>
                  </div>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
