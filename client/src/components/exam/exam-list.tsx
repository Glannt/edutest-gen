import React, { useState } from 'react';
import {
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Pagination,
  Spinner,
  useDisclosure,
  addToast,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { ExamResponse } from '@/types/exam';
import {
  usePagedExams,
  useDeleteExam,
  useExportSingleExam,
  useExportMultipleExams,
} from '@/hooks/useExam';
import { ExamViewModal } from '@/components/exam/modal/exam-view-modal';
import { ExamEditModal } from '@/components/exam/modal/exam-edit-modal';
import { ExamDeleteModal } from '@/components/exam/modal/exam-delete-modal';
import { ExportModal } from '@/components/exam/modal/export-modal';

export const ExamList: React.FC = () => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const [selectedExam, setSelectedExam] = useState<ExamResponse | undefined>(
    undefined
  );

  // Modal controls
  const viewModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();
  const exportModal = useDisclosure();
  const [multipleFiles, setMultipleFiles] = useState(false);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [singleExamId, setSingleExamId] = useState<string>('');

  const exportSingle = useExportSingleExam();
  const exportMultiple = useExportMultipleExams();

  // Fetch paged exams
  const {
    data: examsPage,
    isLoading,
    refetch,
  } = usePagedExams(page, itemsPerPage);

  const deleteExamMutation = useDeleteExam();

  // Handlers
  const handleViewExam = (exam: ExamResponse) => {
    setSelectedExam(exam);
    viewModal.onOpen();
  };

  const handleEditExam = (exam: ExamResponse) => {
    setSelectedExam(exam);
    editModal.onOpen();
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
      console.error('Delete exam error:', error);
    }
  };

  const handleSaveExam = () => {
    // Bạn có thể implement logic update exam ở đây
    editModal.onClose();
    refetch();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';

    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getExamStatus = (exam: ExamResponse) => {
    const now = new Date();

    if (!exam.startTime)
      return { label: 'Chưa lên lịch', color: 'default' as const };
    const startTime = new Date(exam.startTime);
    const endTime = exam.endTime ? new Date(exam.endTime) : null;

    if (now < startTime)
      return { label: 'Sắp diễn ra', color: 'primary' as const };
    else if (!endTime || now <= endTime)
      return { label: 'Đang diễn ra', color: 'success' as const };
    else return { label: 'Đã kết thúc', color: 'default' as const };
  };

  const totalPages = examsPage?.totalPages ?? 1;

  const handleOpenExportModal = (isMultiple: boolean) => {
    setMultipleFiles(isMultiple);

    // Nếu single, chọn mặc định một đề đầu tiên (tuỳ chọn)
    const firstExamId = examsPage?.content?.[0]?.id?.toString() ?? '';

    if (!isMultiple) {
      setSingleExamId(firstExamId);
    } else {
      setSelectedExams([]);
    }

    exportModal.onOpen();
  };

  const handleExport = async () => {
    try {
      if (multipleFiles && selectedExams.length > 0) {
        await handleExportMultiple(selectedExams.map(Number), 'word');
      } else if (!multipleFiles && singleExamId) {
        await handleExportSingle(Number(singleExamId), 'word');
      }
      addToast({
        title: 'Đã xuất file' + singleExamId + 'thành công',
        color: 'success',
        timeout: 2000,
      });
      exportModal.onClose();
    } catch (error) {
      addToast({
        title: 'Đã xuất file' + singleExamId + 'thất bại',
        color: 'danger',
        timeout: 2000,
      });
    }
  };

  const handleExportMultiple = async (
    examIds: number[],
    format: 'pdf' | 'word'
  ) => {
    try {
      // Lấy mảng URL từ backend
      const urls = await exportMultiple.mutateAsync({ examIds, format }); // string[]

      // Xác định extension dựa trên format
      const extension = format === 'pdf' ? 'pdf' : 'docx';
      const baseUrl = process.env.VITE_API_URL;

      // Download từng file
      urls.forEach((url, index) => {
        const link = document.createElement('a');

        link.href = baseUrl + '/' + url;
        link.download = `exam_${examIds[index]}.${extension}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
    } catch (error) {
      console.error('Export multiple exams error:', error);
    }
  };

  const handleExportSingle = async (examId: number, format: 'pdf' | 'word') => {
    try {
      // Gọi API để nhận Blob
      const blob = await exportSingle.mutateAsync({ examId, format });

      // Xác định extension dựa trên format
      const extension = format === 'pdf' ? 'pdf' : 'docx';

      // Tạo URL tạm thời từ Blob
      const url = window.URL.createObjectURL(blob);

      // Tạo <a> để trigger download
      const link = document.createElement('a');

      link.href = url;
      link.download = `exam_${examId}.${extension}`;
      document.body.appendChild(link);
      link.click();

      // Dọn dẹp
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export single exam error:', error);
    }
  };

  return (
    <div className='flex flex-col gap-4 h-80vh'>
      {/* Header */}
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Danh sách đề thi</h2>
        <div className='flex space-x-2'>
          <Button
            color='primary'
            startContent={<Icon icon='lucide:file-down' />}
            onPress={() => handleOpenExportModal(true)} // mặc định multiple
          >
            Xuất File
          </Button>
          <Button
            color='primary'
            isLoading={isLoading}
            startContent={<Icon icon='lucide:refresh-cw' />}
            onPress={() => refetch()}
          >
            Làm mới
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className='flex justify-center py-20'>
          <Spinner label='Đang tải dữ liệu...' />
        </div>
      )}

      {/* Empty state */}
      {!isLoading &&
        (!examsPage?.content || examsPage.content.length === 0) && (
          <div className='py-6 text-center text-gray-500'>
            Không có đề thi nào
          </div>
        )}

      {/* Table */}
      {!isLoading && examsPage?.content && examsPage.content.length > 0 && (
        <>
          <Table
            isHeaderSticky
            removeWrapper
            aria-label='Danh sách đề thi'
          >
            <TableHeader>
              <TableColumn>MÃ</TableColumn>
              <TableColumn>TÊN ĐỀ THI</TableColumn>
              <TableColumn>SỐ CÂU HỎI</TableColumn>
              <TableColumn>THỜI GIAN BẮT ĐẦU</TableColumn>
              <TableColumn>THỜI GIAN KẾT THÚC</TableColumn>
              <TableColumn>TRẠNG THÁI</TableColumn>
              <TableColumn>THAO TÁC</TableColumn>
            </TableHeader>
            <TableBody items={examsPage.content}>
              {(exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.code || `#${exam.id}`}</TableCell>
                  <TableCell>{exam.name}</TableCell>
                  <TableCell>{exam.questions?.length || 0}</TableCell>
                  <TableCell>{formatDate(exam.startTime)}</TableCell>
                  <TableCell>{formatDate(exam.endTime)}</TableCell>
                  <TableCell>
                    <Chip
                      color={getExamStatus(exam).color}
                      size='sm'
                      variant='flat'
                    >
                      {getExamStatus(exam).label}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2'>
                      <Tooltip content='Xem chi tiết'>
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          onPress={() => handleViewExam(exam)}
                        >
                          <Icon
                            className='text-lg'
                            icon='lucide:eye'
                          />
                        </Button>
                      </Tooltip>
                      <Tooltip content='Chỉnh sửa'>
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          onPress={() => handleEditExam(exam)}
                        >
                          <Icon
                            className='text-lg'
                            icon='lucide:edit'
                          />
                        </Button>
                      </Tooltip>
                      <Tooltip content='Xóa'>
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
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className='flex justify-center mt-4'>
            <Pagination
              showControls
              boundaries={1}
              page={page}
              siblings={1}
              total={totalPages}
              onChange={setPage}
            />
          </div>
        </>
      )}

      {/* Modals */}
      <ExamViewModal
        exam={selectedExam || null}
        isOpen={viewModal.isOpen}
        onOpenChange={viewModal.onOpenChange}
      />
      <ExamEditModal
        exam={selectedExam || null}
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

      <ExportModal
        exams={examsPage?.content || []}
        handleExport={handleExport}
        isOpen={exportModal.isOpen}
        multipleFiles={multipleFiles}
        selectedExams={selectedExams}
        setMultipleFiles={setMultipleFiles}
        setSelectedExams={setSelectedExams}
        setSingleExamId={setSingleExamId}
        singleExamId={singleExamId}
        onOpenChange={() => exportModal.onClose()}
      />
    </div>
  );
};
