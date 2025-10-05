'use client';
import React, { useState } from 'react';
import { SortDescriptor, Selection, Button, Tooltip } from '@heroui/react';

import { GenericTable } from '@/components/table/generic-table';
import { initialLevels } from '@/data/level.data';
import { LevelInterface } from '@/interface/level.interface';
import { INITIAL_VISIBLE_LEVEL_COLUMNS, levelColumns } from '@/utils/column';
import { useTableData } from '@/hooks/useTableData';
import { StatusOptions } from '@/interface/status-option.interface';
import { TopContent } from '@/components/table/top-content';
import LevelModal from '@/components/level/level-modal';
import { EyeFilledIcon } from '@/components/icons';

export default function LevelTable() {
  const [levels, setLevels] = useState<LevelInterface[]>(initialLevels);
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

  const { headerColumns, filteredItems, sortedItems, pages } =
    useTableData<LevelInterface>({
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

  // Modal thêm mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLevel, setNewLevel] = useState<Partial<LevelInterface>>({
    name: '',
    description: '',
    points: 0,
  });

  const handleInputChange = (field: string, value: string) => {
    setNewLevel((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const newItem: LevelInterface = {
      id: String(Date.now()),
      name: newLevel.name || '',
      description: newLevel.description || '',
      points: Number(newLevel.points) || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      actions: '',
    };

    setLevels((prev) => [...prev, newItem]);
    setIsModalOpen(false);
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

  return (
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
  );
}
