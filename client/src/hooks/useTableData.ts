import { Selection, SortDescriptor } from '@react-types/shared';
import React from 'react';

import { StatusOptions } from '@/interface/status-option.interface';

export interface UseTableDataProps<T> {
  data: T[];
  columns: { name: string; uid: string; sortable?: boolean }[];
  visibleColumns: Selection;
  filterValue: string;
  hasSearchFilter: boolean;
  statusFilter: Selection;
  statusOptions: StatusOptions[];
  rowsPerPage: number;
  page: number;
  sortDescriptor: SortDescriptor;
}
export function useTableData<T extends Record<string, any>>(
  props: UseTableDataProps<T>
) {
  const {
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
  } = props;

  // Header columns
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((c) => Array.from(visibleColumns).includes(c.uid));
  }, [visibleColumns, columns]);

  // Filtered items
  const filteredItems = React.useMemo(() => {
    let result = [...data];

    if (hasSearchFilter) {
      const lowerSearch = filterValue.toLowerCase();

      result = result.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(lowerSearch)
        )
      );
    }

    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      result = result.filter((item) =>
        Array.from(statusFilter).includes(item.status)
      );
    }

    return result;
  }, [data, filterValue, statusFilter, statusOptions, hasSearchFilter]);

  // Pagination
  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  // Sorting
  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [items, sortDescriptor]);

  return {
    headerColumns,
    filteredItems,
    sortedItems,
    pages,
  };
}
