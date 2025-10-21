import React, { useState } from 'react';
import {
  Card,
  Spinner,
  Pagination,
  Button,
  addToast,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

import { useMatrices, useUpdateMatrix } from '@/hooks/useMatrix';
import { MatrixTable } from '@/components/matrix/matrix-table';
import {
  MatrixDetailRequest,
  MatrixDetailResponse,
  MatrixRequest,
} from '@/types/matrix';
import { useQuestionTypes } from '@/hooks/useQuestionTypes';
import { FileExportMatrix } from '@/components/matrix/modal/file-export-modal';

export const MatrixList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const itemsPerPage = 5; // Số ma trận trên 1 trang
  const [editMode, setEditMode] = useState<Record<number, boolean>>({});
  const [editedMatrices, setEditedMatrices] = useState<Record<number, any>>({});
  const selectExportFileModal = useDisclosure();
  const [selectedMatrixId, setSelectedMatrixId] = useState<number | null>(null);
  const {
    data: matricesPage,
    isLoading,
    refetch,
  } = useMatrices(page, itemsPerPage);
  const { mutateAsync: updateMatrix, isPending } = useUpdateMatrix();
  const { data: questionTypesData, isLoading: loadingQTypes } =
    useQuestionTypes();
  const handleViewExams = (matrixId: string) => {
    navigate(`/dashboard/matrix/${matrixId}/exams`);
  };

  const handleEditToggle = (matrixId: number) => {
    setEditMode((prev) => ({
      ...prev,
      [matrixId]: !prev[matrixId],
    }));
  };

  const handleMatrixChange = (matrixId: number, updated: any) => {
    setEditedMatrices((prev) => ({
      ...prev,
      [matrixId]: updated,
    }));
  };

  const handleExportClick = (matrixId: number) => {
    setSelectedMatrixId(matrixId);
    selectExportFileModal.onOpen();
  };

  /** Lưu ma trận sau khi chỉnh sửa */
  const handleSaveMatrix = async (matrixId: number) => {
    const updated = editedMatrices[matrixId];

    if (!updated) return;

    try {
      console.log('✅ Save matrix:', updated);

      // Map sang payload nếu cần
      const payload: MatrixRequest = {
        name: updated.name,
        description: updated.description,
        totalQuestions: updated.totalQuestions,
        durationMinutes: updated.durationMinutes,
        userId: updated.userId,
        matrixDetails: updated.matrixDetails.map(
          (d: MatrixDetailResponse): MatrixDetailRequest => ({
            matrixId: updated.id,
            levelId: d.level.id,
            lessonId: d.lesson.id,
            questionTypeId: (() => {
              // Nếu bạn đang có danh sách questionTypesData từ hook
              // hãy tìm ID theo name để đảm bảo đúng backend
              const qt = questionTypesData?.find(
                (q) => q.name === d.question_type_name
              );

              return qt ? qt.id : 0; // fallback
            })(), // fallback an toàn
            quantity: d.quantity,
          })
        ),
      };

      await updateMatrix({ id: updated.id, payload });
      setEditMode((prev) => ({ ...prev, [matrixId]: false }));
      addToast({
        title: 'Chỉnh sửa thành công',
        color: 'success',
        timeout: 2000,
      });
    } catch (err) {
      addToast({
        title: 'Lỗi khi cập nhật ma trận:' + err,
        color: 'danger',
        timeout: 2000,
      });
    }
  };

  if (isLoading)
    return (
      <div className='flex justify-center items-center h-40'>
        <Spinner label='Đang tải danh sách ma trận...' />
      </div>
    );

  if (!matricesPage?.content || matricesPage.content?.length === 0) {
    return <div className='text-center text-gray-500'>Chưa có ma trận nào</div>;
  }

  const totalPages = matricesPage.totalPages || 1;

  return (
    <div className='space-y-6'>
      {matricesPage.content.map((matrix) => {
        const isEditing = editMode[matrix.id] ?? false;
        const currentMatrix = editedMatrices[matrix.id] ?? matrix;

        return (
          <Card
            key={matrix.id}
            className='shadow-sm'
          >
            <div className='p-4 flex items-center justify-between border-b'>
              <div className='flex items-center gap-2'>
                <Icon
                  className='text-lg'
                  icon='lucide:grid'
                />
                <span className='font-semibold text-lg'>{matrix.name}</span>
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  color='primary'
                  endContent={<Icon icon='lucide:folder-input' />}
                  onPress={() => handleExportClick(matrix.id)}
                >
                  Xuất File
                </Button>
                <Button
                  color='primary'
                  endContent={<Icon icon='lucide:clipboard-list' />}
                  onPress={() => handleViewExams(String(matrix.id))}
                >
                  Xem bài thi
                </Button>

                {isEditing ? (
                  <>
                    <Button
                      color='success'
                      endContent={<Icon icon='lucide:check' />}
                      onPress={() => handleSaveMatrix(matrix.id)}
                    >
                      Lưu
                    </Button>
                    <Button
                      color='danger'
                      endContent={<Icon icon='lucide:x' />}
                      variant='light'
                      onPress={() => handleEditToggle(matrix.id)}
                    >
                      Hủy
                    </Button>
                  </>
                ) : (
                  <Button
                    color='warning'
                    endContent={<Icon icon='lucide:edit-3' />}
                    onPress={() => handleEditToggle(matrix.id)}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </div>

            <div className='p-4'>
              <MatrixTable
                editable={isEditing}
                matrix={currentMatrix}
                onChange={(updated) => handleMatrixChange(matrix.id, updated)}
              />
            </div>
          </Card>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-4'>
          <Pagination
            showControls
            page={page + 1}
            total={totalPages}
            onChange={(p) => setPage(p - 1)}
          />
        </div>
      )}
      <FileExportMatrix
        isOpen={selectExportFileModal.isOpen}
        matrixId={selectedMatrixId}
        onClose={selectExportFileModal.onClose}
      />
    </div>
  );
};
