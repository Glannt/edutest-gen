import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spinner, Button, useDisclosure, addToast } from '@heroui/react';
import { Icon } from '@iconify/react';

import { useMatrix } from '@/hooks/useMatrix';
import { useDeleteExam, usePagedExamsByMatrixId } from '@/hooks/useExam';
import { ExamResponse } from '@/types/exam';
import { ExamViewModal } from '@/components/exam/modal/exam-view-modal';
import { ExamEditModal } from '@/components/exam/modal/exam-edit-modal';
import { ExamDeleteModal } from '@/components/exam/modal/exam-delete-modal';

interface ExamEditForm {
  name: string;
  questionCount: number;
  startTime: string;
  endTime: string;
}

export const MatrixExamList = () => {
  const { matrixId } = useParams<{ matrixId: string }>();
  const navigate = useNavigate();

  const { data: matrix, isLoading: matrixLoading } = useMatrix(
    Number(matrixId)
  );
  const {
    data: examPage,
    isLoading: examsLoading,
    refetch,
  } = usePagedExamsByMatrixId(Number(matrixId));

  const viewModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const [selectedExam, setSelectedExam] = React.useState<ExamResponse | null>(
    null
  );
  const [editFormData, setEditFormData] = React.useState<ExamEditForm>({
    name: '',
    questionCount: 0,
    startTime: '',
    endTime: '',
  });

  const exams = examPage?.content ?? [];

  const handleBack = () => navigate('/dashboard/matrix');
  const handleCreateExam = () => navigate('/dashboard/exam');

  const handleViewExam = (exam: ExamResponse) => {
    setSelectedExam(exam);
    viewModal.onOpen();
  };
  const deleteExamMutation = useDeleteExam();
  const handleEditExam = (exam: ExamResponse) => {
    setSelectedExam(exam);
    setEditFormData({
      name: exam.name ?? '',
      questionCount: exam.questions?.length ?? 0,
      startTime: exam.startTime ?? '',
      endTime: exam.endTime ?? '',
    });
    editModal.onOpen();
  };
  const handleSaveExam = () => {
    // Bạn có thể implement logic update exam ở đây
    editModal.onClose();
    refetch();
  };
  const handleDeleteExam = (exam: ExamResponse) => {
    setSelectedExam(exam);
    deleteModal.onOpen();
  };

  const handleConfirmDelete = async () => {
    if (!selectedExam) return;
    try {
      await deleteExamMutation.mutateAsync(selectedExam.id);
      deleteModal.onClose();
      refetch();
    } catch (error) {
      addToast({
        title: 'Delete exam error:' + error,
        color: 'danger',
        timeout: 2000,
      });
    }
  };

  if (matrixLoading || examsLoading) {
    return (
      <div className='flex justify-center items-center h-40'>
        <Spinner label='Đang tải danh sách bài thi...' />
      </div>
    );
  }

  if (!matrix) {
    return (
      <div className='text-center'>
        <div className='text-gray-500 mb-4'>Không tìm thấy ma trận</div>
        <Button
          color='primary'
          onPress={handleBack}
        >
          Quay lại danh sách ma trận
        </Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-3'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold flex items-center gap-2'>
            <Icon
              className='text-primary'
              icon='lucide:clipboard-list'
            />
            Danh sách bài thi cho ma trận: {matrix.name}
          </h2>
          <p className='text-gray-500 mt-1'>
            Tổng số bài thi: {examPage?.totalElements ?? 0}
          </p>
        </div>
        <Button
          color='default'
          startContent={<Icon icon='lucide:arrow-left' />}
          variant='flat'
          onPress={handleBack}
        >
          Quay lại
        </Button>
      </div>

      {exams.length === 0 ? (
        <Card className='p-8 text-center'>
          <Icon
            className='text-4xl text-gray-400 mx-auto mb-2'
            icon='lucide:clipboard-x'
          />
          <p className='text-gray-500'>Chưa có bài thi nào cho ma trận này</p>
          <Button
            className='mt-4'
            color='primary'
            onPress={handleCreateExam}
          >
            Tạo bài thi mới
          </Button>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {exams.map((exam) => (
            <Card
              key={exam.id}
              className='shadow-sm w-full'
            >
              <div className='p-4 flex justify-between items-center'>
                <h3 className='font-semibold text-lg truncate'>{exam.name}</h3>
                <div className='flex'>
                  <Button
                    isIconOnly
                    color='danger'
                    size='sm'
                    variant='light'
                    onPress={() => handleDeleteExam(exam)}
                  >
                    <Icon
                      className='text-lg'
                      icon='lucide:trash-2'
                    />
                  </Button>
                </div>
              </div>

              <div className='p-4'>
                <div className='grid grid-cols-2 gap-y-2'>
                  <div className='flex items-center gap-2'>
                    <Icon
                      className='text-gray-400'
                      icon='lucide:calendar'
                    />
                    <span>
                      Ngày tạo:{' '}
                      {exam.createdAt
                        ? new Date(exam.createdAt).toLocaleDateString('vi-VN')
                        : '---'}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Icon
                      className='text-gray-400'
                      icon='lucide:help-circle'
                    />
                    <span>Số câu hỏi: {exam.questions?.length ?? 0}</span>
                  </div>
                </div>
              </div>
              <div className='p-4 pt-0 flex justify-end gap-2'>
                <Button
                  color='default'
                  startContent={<Icon icon='lucide:eye' />}
                  variant='flat'
                  onPress={() => handleViewExam(exam)}
                >
                  Xem chi tiết
                </Button>
                <Button
                  color='primary'
                  startContent={<Icon icon='lucide:edit-3' />}
                  onPress={() => handleEditExam(exam)}
                >
                  Chỉnh sửa
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 🟦 Modal Chi tiết */}
      <ExamViewModal
        exam={selectedExam}
        isOpen={viewModal.isOpen}
        onOpenChange={viewModal.onOpenChange}
      />

      {/* 🟩 Modal Chỉnh sửa */}
      <ExamEditModal
        exam={selectedExam}
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        onSave={handleSaveExam}
      />

      <ExamDeleteModal
        exam={selectedExam || null}
        isOpen={deleteModal.isOpen}
        onConfirmDelete={handleConfirmDelete}
        onOpenChange={deleteModal.onOpenChange}
      />
    </div>
  );
};
