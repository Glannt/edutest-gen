import React, { useMemo, useState } from 'react';
import {
  SortDescriptor,
  Selection,
  Button,
  Tooltip,
  CircularProgress,
  useDisclosure,
  addToast,
} from '@heroui/react';

import { GenericTable } from '@/components/table/generic-table';
import { TopContent } from '@/components/table/top-content';
import { gradeColumns, INITIAL_VISIBLE_GRADE_COLUMNS } from '@/utils/column';
import { useTableData } from '@/hooks/useTableData';
import { GradePayload } from '@/types/grade';
import {
  useGrades,
  useCreateGrade,
  useUpdateGrade,
  useDeleteGrade,
} from '@/hooks/useGrades';
import { EyeFilledIcon, EditIcon, RecycleBinIcon } from '@/components/icons';
import { CreateGradeModal } from '@/components/grade/create-grade-modal';
import { ViewGradeModal } from '@/components/grade/view-grade-modal';
import { EditGradeModal } from '@/components/grade/edit-grade-modal';
import { DeleteGradeModal } from '@/components/grade/delete-grade-modal';

export default function GradeTable() {
  // --- API Hooks ---
  const { data: gradesPayload = [], isLoading } = useGrades();
  const createGrade = useCreateGrade();
  const updateGrade = useUpdateGrade();
  const deleteGrade = useDeleteGrade();

  // --- Map payload -> interface ---
  const grades: GradePayload[] = useMemo(() => gradesPayload, [gradesPayload]);

  // --- UI States ---
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_GRADE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);

  // --- Table Data ---
  const { headerColumns, sortedItems } = useTableData<GradePayload>({
    data: grades,
    columns: gradeColumns,
    visibleColumns,
    filterValue,
    hasSearchFilter,
    statusFilter: undefined,
    statusOptions: [],
    rowsPerPage,
    page,
    sortDescriptor,
  });

  // --- Modal Disclosures ---
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const viewModal = useDisclosure();
  const deleteModal = useDisclosure();

  // --- Selected Grade for view/edit/delete ---
  const [selectedGrade, setSelectedGrade] = useState<GradePayload | null>(null);
  const [newGrade, setNewGrade] = useState<Partial<GradePayload>>({
    name: '',
  });

  // --- Render Cell ---
  const renderCell = React.useCallback(
    (grade: GradePayload, columnKey: React.Key) => {
      const cellValue = grade[columnKey as keyof GradePayload];

      switch (columnKey) {
        case 'name':
          return <span className='font-medium'>{grade.name}</span>;
        case 'level':
          return <span>{grade.level}</span>;
        case 'created_by':
          return <span>{grade.created_by}</span>;
        case 'actions':
          return (
            <div className='space-x-2'>
              <Tooltip
                content='Chi tiết'
                delay={50}
              >
                <Button
                  size='sm'
                  onPress={() => {
                    setSelectedGrade(grade);
                    viewModal.onOpen();
                  }}
                >
                  <EyeFilledIcon
                    height={16}
                    width={16}
                  />
                </Button>
              </Tooltip>

              <Tooltip
                content='Chỉnh sửa'
                delay={50}
              >
                <Button
                  size='sm'
                  onPress={() => {
                    setSelectedGrade(grade);
                    editModal.onOpen();
                  }}
                >
                  <EditIcon
                    height={16}
                    width={16}
                  />
                </Button>
              </Tooltip>

              <Tooltip
                content='Xóa'
                delay={50}
              >
                <Button
                  size='sm'
                  onPress={() => {
                    setSelectedGrade(grade);
                    deleteModal.onOpen();
                  }}
                >
                  <RecycleBinIcon
                    height={16}
                    width={16}
                  />
                </Button>
              </Tooltip>
            </div>
          );
        case 'created_at':
        case 'updated_at':
          return new Date(cellValue as string).toLocaleDateString();
        default:
          return cellValue as string;
      }
    },
    []
  );

  // --- Handlers ---
  const handleCreateInputChange = (
    field: keyof GradePayload,
    value: string | number
  ) => {
    setNewGrade((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSubmit = async () => {
    if (!newGrade.name) return;
    try {
      await createGrade.mutateAsync(newGrade as GradePayload);
      setNewGrade({ name: '' });
      createModal.onClose();
      addToast({
        title: 'Tạo khối lớp mới thành công',
        color: 'success',
        timeout: 2000,
      });
    } catch {
      addToast({
        title: 'Tạo khối lớp lỗi',
        color: 'danger',
        timeout: 2000,
      });
    }
  };

  const handleEditChange = (
    field: keyof GradePayload,
    value: string | number
  ) => {
    if (!selectedGrade) return;
    setSelectedGrade({ ...selectedGrade, [field]: value });
  };

  const handleEditSubmit = async () => {
    if (!selectedGrade) return;
    try {
      await updateGrade.mutateAsync({
        id: selectedGrade.id,
        payload: selectedGrade,
      });
      editModal.onClose();

      addToast({
        title: 'Cập nhật khối lớp thành công',
        color: 'success',
        timeout: 2000,
      });
    } catch {
      addToast({
        title: 'Cập nhật khối lớp lỗi',
        color: 'danger',
        timeout: 2000,
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedGrade) return;
    try {
      await deleteGrade.mutateAsync(selectedGrade.id);
      deleteModal.onClose();
      addToast({
        title: 'Xóa khối lớp thành công',
        color: 'success',
        timeout: 2000,
      });
    } catch {
      addToast({
        title: 'Xóa khối lớp lỗi',
        color: 'danger',
        timeout: 2000,
      });
    }
  };

  // --- Top Content Props ---
  const topContentProps = {
    columns: gradeColumns,
    filterValue,
    total: grades.length,
    visibleColumns,
    onClear: () => {
      setFilterValue('');
      setPage(1);
    },
    onColumnsChange: setVisibleColumns,
    onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    onSearchChange: (v?: string) => {
      setFilterValue(v || '');
      setPage(1);
    },
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <CircularProgress title='Đang tải dữ liệu...' />
      </div>
    );
  }

  return (
    <>
      <GenericTable<GradePayload>
        columns={gradeColumns}
        data={grades}
        filterValue={filterValue}
        hasSearchFilter={hasSearchFilter}
        headerColumns={headerColumns}
        page={page}
        renderCell={renderCell}
        rowsPerPage={rowsPerPage}
        selectedKeys={selectedKeys}
        setFilterValue={setFilterValue}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        setSelectedKeys={setSelectedKeys}
        setSortDescriptor={setSortDescriptor}
        setVisibleColumns={setVisibleColumns}
        sortDescriptor={sortDescriptor}
        sortedItems={sortedItems}
        topContent={
          <TopContent
            {...topContentProps}
            extraActions={
              <>
                <Button
                  color='primary'
                  onPress={createModal.onOpen}
                >
                  Thêm mới
                </Button>
                <CreateGradeModal
                  handleInputChange={handleCreateInputChange}
                  handleSubmit={handleCreateSubmit}
                  isOpen={createModal.isOpen}
                  newGrade={newGrade}
                  onOpenChange={createModal.onOpenChange}
                />
                {selectedGrade && (
                  <>
                    <ViewGradeModal
                      grade={selectedGrade}
                      isOpen={viewModal.isOpen}
                      onOpenChange={viewModal.onOpenChange}
                    />
                    <EditGradeModal
                      grade={selectedGrade}
                      handleInputChange={handleEditChange}
                      handleSubmit={handleEditSubmit}
                      isOpen={editModal.isOpen}
                      onOpenChange={editModal.onOpenChange}
                    />
                    <DeleteGradeModal
                      gradeName={selectedGrade.name}
                      isOpen={deleteModal.isOpen}
                      onDelete={handleDelete}
                      onOpenChange={deleteModal.onOpenChange}
                    />
                  </>
                )}
              </>
            }
          />
        }
        visibleColumns={visibleColumns}
      />
    </>
  );
}
