import React, { useState } from 'react';
import { SortDescriptor, Selection, Button, Tooltip } from '@heroui/react';

import { GenericTable } from '@/components/table/generic-table';
import { initialSubjects } from '@/data/subject.data';
import { SubjectInterface } from '@/interface/subject.interface';
import {
  INITIAL_VISIBLE_SUBJECT_COLUMNS,
  subjectColumns,
} from '@/utils/column';
import { useTableData } from '@/hooks/useTableData';
import { StatusOptions } from '@/interface/status-option.interface';
import { TopContent } from '@/components/table/top-content';
import SubjectModal from '@/components/subject/subject-modal';
import { EyeFilledIcon } from '@/components/icons';

export default function SubjectTable() {
  // --- State ---
  const [subjects, setSubjects] = useState<SubjectInterface[]>(initialSubjects);
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_SUBJECT_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [statusFilter, setStatusFilter] = useState<Selection>('all');
  const statusOptions: StatusOptions[] = [];
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  // --- Table data logic (gom vào hook) ---
  const { headerColumns, filteredItems, sortedItems, pages } =
    useTableData<SubjectInterface>({
      data: subjects,
      columns: subjectColumns,
      visibleColumns,
      filterValue,
      hasSearchFilter,
      statusFilter: statusFilter, // Subject không có status
      statusOptions: statusOptions, // Subject không có status
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
            <div className='max-w-xs truncate text-default-500'>
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', description: '' });

  const handleInputChange = (field: string, value: string) => {
    setNewSubject((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // logic thêm subject
    console.log('New Subject:', newSubject);
    setIsModalOpen(false);
  };
  const topContentProps = {
    columns: subjectColumns,
    filterValue,
    statusFilter,
    statusOptions,
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
    onStatusChange: setStatusFilter,
  };

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
    </>
  );
}
