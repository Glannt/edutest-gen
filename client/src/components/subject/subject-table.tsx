import React, { useMemo, useState } from 'react';
import {
  SortDescriptor,
  Selection,
  Button,
  Tooltip,
  CircularProgress,
  useDisclosure,
} from '@heroui/react';

import { GenericTable } from '@/components/table/generic-table';
import { SubjectInterface } from '@/interface/subject.interface';
import {
  INITIAL_VISIBLE_SUBJECT_COLUMNS,
  subjectColumns,
} from '@/utils/column';
import { useTableData } from '@/hooks/useTableData';
import { TopContent } from '@/components/table/top-content';
import SubjectModal from '@/components/subject/subject-modal';
import { EditIcon, EyeFilledIcon, RecycleBinIcon } from '@/components/icons';
import {
  useCreateSubject,
  useDeleteSubject,
  useSubjects,
  useUpdateSubject,
} from '@/hooks/useSubjects';
import { mapSubjectsPayloadList } from '@/mappers/subject.mapper';
import { SubjectPayload } from '@/types/subject';
import { EditSubjectModal } from '@/components/subject/edit-subject-modal';
import { ViewSubjectModal } from '@/components/subject/view-subject-modal';
import { DeleteSubjectModal } from '@/components/subject/delete-subject-modal';

export default function SubjectTable() {
  // ---- React Query ----
  const { data: subjectsPayload = [], isLoading } = useSubjects();
  const createSubject = useCreateSubject();
  const deleteSubject = useDeleteSubject();
  const updateSubject = useUpdateSubject();

  // ---- Map payload -> interface (memoized) ----
  const subjects: SubjectInterface[] = useMemo(
    () => mapSubjectsPayloadList(subjectsPayload),
    [subjectsPayload]
  );

  // ---- UI State ----
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_SUBJECT_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);

  // --- Table data logic (gom vào hook) ---
  const { headerColumns, sortedItems } = useTableData<SubjectInterface>({
    data: subjects,
    columns: subjectColumns,
    visibleColumns,
    filterValue,
    hasSearchFilter,
    rowsPerPage,
    page,
    sortDescriptor,
  });

  // renderCell
  const renderCell = React.useCallback(
    (subject: SubjectInterface, columnKey: React.Key) => {
      const cellValue = subject[columnKey as keyof SubjectInterface];

      switch (columnKey) {
        case 'name':
          return <span className='font-medium'>{subject.name}</span>;
        case 'description':
          return (
            <div className='max-w-xs truncate text-default-500'>
              {subject.description}
            </div>
          );
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
                    const fullSubject =
                      subjectsPayload.find((s) => s.id === subject.id) ?? null;

                    setSelectedSubject(fullSubject);
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
                    const fullSubject =
                      subjectsPayload.find((s) => s.id === subject.id) ?? null;

                    setEditSubject(fullSubject);
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
                  isIconOnly
                  size='sm'
                  onPress={() => {
                    const fullSubject =
                      subjectsPayload.find((s) => s.id === subject.id) ?? null;

                    setSelectedSubject(fullSubject);
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
          return new Date(
            subject[columnKey as keyof SubjectInterface] as string
          ).toLocaleDateString();
        default:
          return cellValue as string;
      }
    },
    []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const viewModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const [newSubject, setNewSubject] = useState({ name: '', description: '' });
  const [selectedSubject, setSelectedSubject] = useState<SubjectPayload | null>(
    null
  );
  const [editSubject, setEditSubject] = useState<SubjectPayload | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setNewSubject((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createSubject.mutateAsync({
        name: newSubject.name || '',
        description: newSubject.description || '',
      });
      setIsModalOpen(false);
      setNewSubject({ name: '', description: '' });
    } catch (error) {
      console.error('Lỗi khi tạo Subject:', error);
    }
  };

  const handleEditChange = (field: keyof SubjectPayload, value: string) => {
    if (!editSubject) return;
    setEditSubject({ ...editSubject, [field]: value });
  };

  const handleEditSubmit = async () => {
    if (!editSubject) return;
    try {
      await updateSubject.mutateAsync({
        id: editSubject.id,
        payload: editSubject,
      });
      editModal.onClose();
    } catch (error) {
      console.error('Cập nhật Subject thất bại:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedSubject) return;
    try {
      await deleteSubject.mutateAsync(selectedSubject.id);
      deleteModal.onClose();
    } catch (error) {
      console.error('Xóa Subject thất bại:', error);
    }
  };

  const topContentProps = {
    columns: subjectColumns,
    filterValue,
    total: subjects.length,
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

  // ---- Loading ----
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
    <>
      <GenericTable<SubjectInterface>
        columns={subjectColumns}
        data={subjects}
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
                  onPress={() => setIsModalOpen(true)}
                >
                  Thêm mới
                </Button>
                <SubjectModal
                  handleInputChange={handleInputChange}
                  handleModalClose={() => setIsModalOpen(false)}
                  handleSubmit={handleSubmit}
                  isOpen={isModalOpen}
                  newSubject={newSubject}
                  onOpenChange={setIsModalOpen}
                />
              </>
            }
          />
        }
        visibleColumns={visibleColumns}
      />

      {/* View Modal */}
      {selectedSubject && (
        <ViewSubjectModal
          isOpen={viewModal.isOpen}
          subject={selectedSubject}
          onOpenChange={viewModal.onOpenChange}
        />
      )}

      {/* Edit Modal */}
      {editSubject && (
        <EditSubjectModal
          handleInputChange={handleEditChange}
          handleSubmit={handleEditSubmit}
          isOpen={editModal.isOpen}
          subject={editSubject}
          onOpenChange={editModal.onOpenChange}
        />
      )}

      {/* Delete Modal */}
      {selectedSubject && (
        <DeleteSubjectModal
          isOpen={deleteModal.isOpen}
          subjectName={selectedSubject.name}
          onDelete={handleDelete}
          onOpenChange={deleteModal.onOpenChange}
        />
      )}
    </>
  );
}
