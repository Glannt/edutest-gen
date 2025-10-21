import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  SortDescriptor,
  Selection,
} from '@heroui/react';

import { BottomContent } from './bottom-content';

import { useTableData } from '@/hooks/useTableData';
import { StatusOptions } from '@/interface/status-option.interface';

interface GenericTableProps<T> {
  data: T[];
  columns: { name: string; uid: string; sortable?: boolean }[];
  headerColumns: { name: string; uid: string; sortable?: boolean }[];
  visibleColumns: Selection;
  filterValue: string;
  hasSearchFilter: boolean;
  statusFilter?: Selection;
  statusOptions?: StatusOptions[];
  rowsPerPage: number;
  page: number;
  sortDescriptor: SortDescriptor;
  sortedItems: T[];
  selectedKeys: any;
  topContent?: React.ReactNode; // 👈 thêm vào
  bottomContent?: React.ReactNode; // 👈 thêm vào
  setVisibleColumns?: (val: any) => void;
  setStatusFilter?: React.Dispatch<React.SetStateAction<Selection>>;
  setFilterValue: (val: string) => void;
  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setSelectedKeys: (keys: any) => void;
  setSortDescriptor: (sort: any) => void;
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode;
}

export function GenericTable<T extends { id: number }>({
  data,
  columns,
  visibleColumns,
  filterValue,
  hasSearchFilter,
  statusFilter,
  statusOptions,
  rowsPerPage,
  page,
  sortDescriptor,
  selectedKeys,
  setVisibleColumns,
  setStatusFilter,
  setFilterValue,
  setPage,
  setRowsPerPage,
  setSelectedKeys,
  setSortDescriptor,
  topContent,
  renderCell,
}: GenericTableProps<T>) {
  const { headerColumns, sortedItems, pages, filteredItems } = useTableData({
    data,
    columns,
    visibleColumns,
    filterValue,
    hasSearchFilter,
    statusFilter,
    statusOptions,
    rowsPerPage,
    page,
    sortDescriptor,
  });

  // const topContent = (
  //   <TopContent
  //     columns={columns}
  //     filterValue={filterValue}
  //     statusFilter={statusFilter}
  //     statusOptions={statusOptions}
  //     total={data.length}
  //     visibleColumns={visibleColumns}
  //     onClear={() => {
  //       setFilterValue('');
  //       setPage(1);
  //     }}
  //     onColumnsChange={setVisibleColumns}
  //     onRowsPerPageChange={(e) => {
  //       setRowsPerPage(Number(e.target.value));
  //       setPage(1);
  //     }}
  //     onSearchChange={(v?: string) => {
  //       setFilterValue(v || '');
  //       setPage(1);
  //     }}
  //     onStatusChange={setStatusFilter}
  //   />
  // );

  const bottomContent = (
    <BottomContent
      page={page}
      pages={pages}
      selectedKeys={selectedKeys}
      totalItems={filteredItems.length}
      totalSelected={selectedKeys.size}
      onNextPage={() => page < pages && setPage(page + 1)}
      onPageChange={setPage}
      onPreviousPage={() => page > 1 && setPage(page - 1)}
    />
  );

  return (
    <Table
      isHeaderSticky
      aria-label='Reusable table with filter, pagination, sorting'
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
      classNames={{
        wrapper: 'max-h-[382px]',
      }}
      selectedKeys={selectedKeys}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement='outside'
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody
        emptyContent={'Không có dữ liệu'}
        items={sortedItems}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
