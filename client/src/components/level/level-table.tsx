'use client';
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
import { LevelInterface } from '@/interface/level.interface';
import { INITIAL_VISIBLE_LEVEL_COLUMNS, levelColumns } from '@/utils/column';
import { useTableData } from '@/hooks/useTableData';
import { StatusOptions } from '@/interface/status-option.interface';
import { TopContent } from '@/components/table/top-content';
import LevelModal from '@/components/level/level-modal';
import { EditIcon, EyeFilledIcon, RecycleBinIcon } from '@/components/icons';
import {
  useCreateLevel,
  useDeleteLevel,
  useLevels,
  useUpdateLevel,
} from '@/hooks/useLevels';
import { LevelPayload } from '@/types/level';
import { ViewLevelModal } from '@/components/level/view-level-modal';
import { EditLevelModal } from '@/components/level/edit-level-modal';
import { DeleteLevelModal } from '@/components/level/delete-level-modal';

export default function LevelTable() {
  const { data: levelsPayload = [], isLoading } = useLevels();
  const createLevel = useCreateLevel();
  const deleteLevel = useDeleteLevel();
  const updateLevel = useUpdateLevel();

  // ---- Map payload -> interface ----
  const levels: LevelInterface[] = useMemo(
    () =>
      levelsPayload.map((lvl) => ({
        id: lvl.id,
        name: lvl.name,
        description: lvl.description,
        points: lvl.points,
        created_at: lvl.created_at,
        updated_at: lvl.updated_at,
        actions: '', // placeholder cho GenericTable
      })),
    [levelsPayload]
  );

  // ---- UI states ----
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_LEVEL_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'points',
    direction: 'ascending',
  });
  const [statusFilter, setStatusFilter] = useState<Selection>('all');
  const statusOptions: StatusOptions[] = [];
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);
  // const [levels, setLevels] = useState<LevelInterface[]>(initialLevels);

  // ---- Table Data ----
  const { headerColumns, sortedItems } = useTableData<LevelInterface>({
    data: levels,
    columns: levelColumns,
    visibleColumns,
    filterValue,
    hasSearchFilter,
    statusFilter,
    statusOptions,
    rowsPerPage,
    page,
    sortDescriptor,
  });

  // ---- Render Cell ----
  const renderCell = React.useCallback(
    (level: LevelInterface, columnKey: React.Key) => {
      const cellValue = level[columnKey as keyof LevelInterface];

      switch (columnKey) {
        case 'name':
          return <span className='font-medium'>{level.name}</span>;
        case 'description':
          return (
            <div className='max-w-xs truncate text-default-500'>
              {level.description}
            </div>
          );
        case 'points':
          return <span>{level.points.toLocaleString()}</span>;
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
                    const fullLevel =
                      levelsPayload.find((l) => l.id === level.id) ?? null;

                    if (!fullLevel) return;
                    setSelectedLevel(fullLevel);
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
                    const fullLevel =
                      levelsPayload.find((l) => l.id === level.id) ?? null;

                    if (!fullLevel) return;
                    setEditLevel(fullLevel);
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
                    const fullLevel =
                      levelsPayload.find((l) => l.id === level.id) ?? null;

                    if (!fullLevel) return;
                    setSelectedLevel(fullLevel);
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
          return new Date(cellValue as string).toLocaleDateString();
        case 'updated_at':
          return new Date(cellValue as string).toLocaleDateString();
        default:
          return cellValue as string;
      }
    },
    []
  );

  // Modal thêm mới
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newLevel, setNewLevel] = useState<Partial<LevelInterface>>({
    name: '',
    description: '',
    points: 0,
  });

  const viewModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const [selectedLevel, setSelectedLevel] = useState<LevelPayload | null>(null);
  const [editLevel, setEditLevel] = useState<LevelPayload | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setNewLevel((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createLevel.mutateAsync({
        name: newLevel.name || '',
        description: newLevel.description || '',
        points: Number(newLevel.points) || 0,
      });
      setIsModalOpen(false);
      setNewLevel({ name: '', description: '', points: 0 });
      addToast({
        title: 'Tạo độ khó thành công',
        color: 'success',
        timeout: 2000,
      });
    } catch {
      addToast({
        title: 'Tạo độ khó lỗi',
        color: 'danger',
        timeout: 2000,
      });
    }
  };

  const handleEditChange = (field: keyof LevelPayload, value: string) => {
    if (!editLevel) return;
    setEditLevel({ ...editLevel, [field]: value });
  };

  const handleEditSubmit = async () => {
    if (!editLevel) return;
    try {
      await updateLevel.mutateAsync({ id: editLevel.id, payload: editLevel });
      editModal.onClose();
      setEditLevel(null);
      addToast({
        title: 'Cập nhật độ khó thành công',
        color: 'success',
        timeout: 2000,
      });
    } catch {
      addToast({
        title: 'Cập nhật độ khó lỗi',
        color: 'danger',
        timeout: 2000,
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedLevel) return;
    try {
      await deleteLevel.mutateAsync(selectedLevel.id);
      deleteModal.onClose();
      setSelectedLevel(null);
      addToast({
        title: 'Xóa độ khó thành công',
        color: 'success',
        timeout: 2000,
      });
    } catch {
      addToast({
        title: 'Xóa độ khó lỗi',
        color: 'danger',
        timeout: 2000,
      });
    }
  };

  const topContentProps = {
    columns: levelColumns,
    filterValue,
    statusFilter,
    statusOptions,
    total: levels.length,
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
    <>
      <GenericTable<LevelInterface>
        columns={levelColumns}
        data={levels}
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
                <LevelModal
                  handleInputChange={handleInputChange}
                  handleModalClose={() => setIsModalOpen(false)}
                  handleSubmit={handleSubmit}
                  isOpen={isModalOpen}
                  newLevel={newLevel}
                  onOpenChange={setIsModalOpen}
                />
              </>
            }
          />
        }
        visibleColumns={visibleColumns}
      />

      {/* View Modal */}
      {selectedLevel && (
        <ViewLevelModal
          isOpen={viewModal.isOpen}
          level={selectedLevel}
          onOpenChange={viewModal.onOpenChange}
        />
      )}

      {/* Edit Modal */}
      {editLevel && (
        <EditLevelModal
          handleInputChange={handleEditChange}
          handleSubmit={handleEditSubmit}
          isOpen={editModal.isOpen}
          level={editLevel}
          onOpenChange={editModal.onOpenChange}
        />
      )}

      {/* Delete Modal */}
      {selectedLevel && (
        <DeleteLevelModal
          isOpen={deleteModal.isOpen}
          levelName={selectedLevel.name}
          onDelete={handleDelete}
          onOpenChange={deleteModal.onOpenChange}
        />
      )}
    </>
  );
}
