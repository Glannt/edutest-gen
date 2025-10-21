import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
  addToast,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import {
  useExportMultipleMatrix,
  useExportSingleMatrix,
} from '@/hooks/useMatrix';

interface FileExportMatrixProps {
  isOpen: boolean;
  onClose: () => void;
  matrixId: number | null;
}

export const FileExportMatrix: React.FC<FileExportMatrixProps> = ({
  isOpen,
  onClose,
  matrixId,
}) => {
  const exportSingle = useExportSingleMatrix();
  const exportMultiple = useExportMultipleMatrix();

  /** --- Xuất 1 file Excel --- */
  const handleExportSingle = async () => {
    if (!matrixId) return;
    try {
      const blob = await exportSingle.mutateAsync(matrixId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `matrix_${matrixId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      addToast({
        title: 'Xuất file ma trận thành công',
        color: 'success',
        timeout: 2000,
      });
    } catch {
      addToast({
        title: 'Xuất file ma trận thất bại',
        color: 'danger',
        timeout: 2000,
      });
    }
  };

  /** --- Xuất nhiều file (ZIP) — demo: lấy cứng 3 cái --- */
  const handleExportMultiple = async () => {
    // try {
    //   const blob = await exportMultiple.mutateAsync([1, 2, 3]); // tùy logic bạn
    //   const url = window.URL.createObjectURL(blob);
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.download = `matrices_export.zip`;
    //   document.body.appendChild(link);
    //   link.click();
    //   link.remove();
    //   window.URL.revokeObjectURL(url);
    // } catch (err) {
    //   console.error(err);
    alert('Xuất nhiều ma trận thất bại!');
    addToast({
      title: 'Xuất nhiều ma trận không thể sử dụng',
      color: 'danger',
      timeout: 2000,
    });
    // }
  };

  const isLoading = exportSingle.isPending || exportMultiple.isPending;

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior='inside'
      size='5xl'
      onClose={onClose}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className='flex flex-col gap-1 border-b border-divider'>
              <div className='flex items-center'>
                <Button
                  isIconOnly
                  className='mr-2'
                  variant='light'
                  onPress={onCloseModal}
                >
                  <Icon icon='lucide:chevron-left' />
                </Button>
                <span>Xuất file ma trận</span>
              </div>
            </ModalHeader>

            <ModalBody className='py-6'>
              <div className='space-y-8 flex justify-evenly'>
                <Button
                  color='primary'
                  isLoading={isLoading}
                  startContent={<Icon icon='lucide:file-spreadsheet' />}
                  onPress={handleExportSingle}
                >
                  Xuất Excel (.xlsx)
                </Button>

                <Button
                  color='secondary'
                  isLoading={isLoading}
                  startContent={<Icon icon='lucide:folder-zip' />}
                  onPress={handleExportMultiple}
                >
                  Xuất nhiều (ZIP)
                </Button>
              </div>

              {isLoading && (
                <div className='flex justify-center mt-6'>
                  <Spinner label='Đang xử lý...' />
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
