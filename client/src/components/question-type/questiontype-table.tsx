import React, { useMemo, useState } from 'react';
import {
  SortDescriptor,
  Selection,
  Button,
  Tooltip,
  CircularProgress,
} from '@heroui/react';

import { GenericTable } from '@/components/table/generic-table';
import {
  INITIAL_VISIBLE_QUESTIONTYPE_COLUMNS,
  questionTypeColumns,
} from '@/utils/column';
import { useTableData } from '@/hooks/useTableData';
import { StatusOptions } from '@/interface/status-option.interface';
import { TopContent } from '@/components/table/top-content';
import QuestionTypeModal from '@/components/question-type/questiontype-modal';
import { EditIcon, EyeFilledIcon, RecycleBinIcon } from '@/components/icons';
import { QuestionTypePayload } from '@/types/question-type';
import {
  useCreateQuestionType,
  useDeleteQuestionType,
  useQuestionTypes,
} from '@/store/useQuestionTypeStore';

export default function QuestionTypeTable() {
  // --- API Hooks ---
  const { data: questionTypesPayload = [], isLoading } = useQuestionTypes();
  const createQuestionType = useCreateQuestionType();
  const deleteQuestionType = useDeleteQuestionType();

  // --- Mapping payload -> interface ---
  const questionTypes = useMemo(
    () =>
      questionTypesPayload.map((qt) => ({
        id: qt.id,
        name: qt.name,
        description: qt.description,
        created_at: qt.created_at,
        updated_at: qt.updated_at,
        actions: '',
      })),
    [questionTypesPayload]
  );

  // --- UI State ---
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_QUESTIONTYPE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [statusFilter, setStatusFilter] = useState<Selection>('all');
  const [page, setPage] = useState(1);
  const statusOptions: StatusOptions[] = [];
  const hasSearchFilter = Boolean(filterValue);

  // --- Table Logic ---
  const { headerColumns, sortedItems } = useTableData<QuestionTypePayload>({
    data: questionTypes,
    columns: questionTypeColumns,
    visibleColumns,
    filterValue,
    hasSearchFilter,
    statusFilter,
    statusOptions,
    rowsPerPage,
    page,
    sortDescriptor,
  });

  // --- Render Cell ---
  const renderCell = React.useCallback(
    (item: QuestionTypePayload, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof QuestionTypePayload];

      switch (columnKey) {
        case 'name':
          return <span className='font-medium'>{item.name}</span>;
        case 'description':
          return (
            <div className='max-w-xs truncate text-default-500'>
              {item.description}
            </div>
          );
        case 'actions':
          return (
            <div className='space-x-2'>
              <Tooltip
                content='Chi tiết'
                delay={50}
              >
                <Button size='sm'>
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
                <Button size='sm'>
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
                  onPress={async () => {
                    const confirmed = window.confirm(
                      `Bạn có chắc muốn xóa "${item.name}"?`
                    );

                    if (!confirmed) return;
                    try {
                      await deleteQuestionType.mutateAsync(item.id);
                    } catch (err) {
                      console.error('Lỗi khi xóa question type:', err);
                      alert('Xóa thất bại! Vui lòng thử lại.');
                    }
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

  // --- Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState<
    Partial<QuestionTypePayload>
  >({
    name: '',
    description: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setNewQuestionType((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createQuestionType.mutateAsync({
        name: newQuestionType.name || '',
        description: newQuestionType.description || '',
      });
      setIsModalOpen(false);
      setNewQuestionType({ name: '', description: '' });
    } catch (error) {
      console.error('Lỗi khi tạo question type:', error);
    }
  };

  const topContentProps = {
    columns: questionTypeColumns,
    filterValue,
    statusFilter,
    statusOptions,
    total: questionTypes.length,
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
    onStatusChange: setStatusFilter,
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <CircularProgress
          className='text-lg'
          title='Đang tải dữ liệu...'
        />
      </div>
    );
  }

  return (
    <GenericTable<QuestionTypePayload>
      columns={questionTypeColumns}
      data={questionTypes}
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
      setStatusFilter={setStatusFilter}
      setVisibleColumns={setVisibleColumns}
      sortDescriptor={sortDescriptor}
      sortedItems={sortedItems}
      statusFilter={statusFilter}
      statusOptions={statusOptions}
      topContent={
        <TopContent
          {...topContentProps}
          extraActions={
            <>
              <Button
                color='primary'
                onPress={() => setIsModalOpen(true)}
              >
                Thêm mới
              </Button>
              <QuestionTypeModal
                handleInputChange={handleInputChange}
                handleModalClose={() => setIsModalOpen(false)}
                handleSubmit={handleSubmit}
                isOpen={isModalOpen}
                newQuestionType={newQuestionType}
                onOpenChange={setIsModalOpen}
              />
            </>
          }
        />
      }
      visibleColumns={visibleColumns}
    />
  );
}
