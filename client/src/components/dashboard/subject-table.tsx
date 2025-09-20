import React from 'react';
import { SortDescriptor, Selection } from '@heroui/react';

import { GenericTable } from '@/components/table/generic-table';
import { initialSubjects } from '@/data/subject.data';
import { SubjectInterface } from '@/interface/subject.interface';
import {
  INITIAL_VISIBLE_SUBJECT_COLUMNS,
  subjectColumns,
} from '@/utils/column';
import { useTableData } from '@/hooks/useTableData';
import { StatusOptions } from '@/interface/status-option.interface';

export default function SubjectTable() {
  // --- State ---
  const [subjects, setSubjects] =
    React.useState<SubjectInterface[]>(initialSubjects);
  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_SUBJECT_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all');
  const statusOptions: StatusOptions[] = [];
  const [page, setPage] = React.useState(1);

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

  // const onNextPage = React.useCallback(() => {
  //   if (page < pages) {
  //     setPage(page + 1);
  //   }
  // }, [page, pages]);

  // const onPreviousPage = React.useCallback(() => {
  //   if (page > 1) {
  //     setPage(page - 1);
  //   }
  // }, [page]);
  // const onRowsPerPageChange = React.useCallback(
  //   (e: React.ChangeEvent<HTMLSelectElement>) => {
  //     setRowsPerPage(Number(e.target.value));
  //     setPage(1); // reset về page đầu tiên
  //   },
  //   []
  // );

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
        case 'created_at':
        case 'updated_at':
          return new Date(cellValue as string).toLocaleDateString();
        default:
          return cellValue as string;
      }
    },
    []
  );

  // topContent
  // const topContent = React.useMemo(
  //   () => (
  //     <TopContent
  //       columns={subjectColumns}
  //       filterValue={filterValue}
  //       statusFilter={statusFilter}
  //       statusOptions={statusOptions}
  //       total={filteredItems.length}
  //       visibleColumns={visibleColumns}
  //       onClear={() => setFilterValue('')}
  //       onColumnsChange={setVisibleColumns}
  //       onRowsPerPageChange={onRowsPerPageChange}
  //       onSearchChange={setFilterValue}
  //       onStatusChange={setStatusFilter}
  //     />
  //   ),
  //   [
  //     filterValue,
  //     visibleColumns,
  //     statusFilter,
  //     filteredItems.length,
  //     onRowsPerPageChange,
  //     setFilterValue,
  //     setStatusFilter,
  //     setVisibleColumns,
  //   ]
  // );

  // bottomContent
  // const bottomContent = React.useMemo(
  //   () => (
  //     <BottomContent
  //       page={page}
  //       pages={pages}
  //       selectedKeys={selectedKeys}
  //       totalItems={filteredItems.length}
  //       totalSelected={
  //         selectedKeys === 'all' ? filteredItems.length : selectedKeys.size
  //       }
  //       onNextPage={onNextPage}
  //       onPageChange={setPage}
  //       onPreviousPage={onPreviousPage}
  //     />
  //   ),
  //   [
  //     page,
  //     pages,
  //     selectedKeys,
  //     filteredItems.length,
  //     onNextPage,
  //     onPreviousPage,
  //   ]
  // );

  return (
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
      visibleColumns={visibleColumns}
    />
  );
}
