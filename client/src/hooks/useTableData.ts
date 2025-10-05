import { Selection, SortDescriptor } from '@react-types/shared';
import React from 'react';

import { StatusOptions } from '@/interface/status-option.interface';
import { useMatrixStore } from '@/store/matrix.store';
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

interface TestStructureItem {
  id: string;
  subject: string;
  grade: string;
  chapter: string;
  lesson: string;
  questionCount: number;
  level: 'NB' | 'TH' | 'VD';
  questionType: 'TN' | 'DS' | 'TLN';
}

export interface TableData {
  chapter: string;
  content: string;
  nb_tn?: number;
  nb_ds?: number;
  nb_tln?: number;
  th_tn?: number;
  th_ds?: number;
  th_tln?: number;
  vd_tn?: number;
  vd_ds?: number;
  vd_tln?: number;
  total_tn?: number;
  total_ds?: number;
  total_tln?: number;
  percentage?: string;
  sectionColor?: string;
  rowSpan?: number;
  isSubRow?: boolean;
}

export const useTableDataMatrix = () => {
  const structures = useMatrixStore<TestStructureItem[]>(
    (s: any) => s.structures
  );

  // Gom theo chapter
  const chapterMap = new Map<string, TestStructureItem[]>();

  structures.forEach((item) => {
    if (!chapterMap.has(item.chapter)) chapterMap.set(item.chapter, []);
    chapterMap.get(item.chapter)!.push(item);
  });

  const tableData: TableData[] = [];

  // Biến tính tổng toàn bảng
  const totalCounts = {
    NB: { TN: 0, DS: 0, TLN: 0 },
    TH: { TN: 0, DS: 0, TLN: 0 },
    VD: { TN: 0, DS: 0, TLN: 0 },
    total_tn: 0,
    total_ds: 0,
    total_tln: 0,
    totalScore: 0,
  };

  chapterMap.forEach((lessons, chapterName) => {
    const rowSpan = lessons.length;

    lessons.forEach((lesson, idx) => {
      const row: TableData = {
        chapter: idx === 0 ? chapterName : '',
        content: lesson.lesson,
        isSubRow: idx !== 0,
        rowSpan: idx === 0 ? rowSpan : undefined,
      };

      // Gán số câu theo level/questionType
      switch (lesson.level) {
        case 'NB':
          if (lesson.questionType === 'TN') row.nb_tn = lesson.questionCount;
          if (lesson.questionType === 'DS') row.nb_ds = lesson.questionCount;
          if (lesson.questionType === 'TLN') row.nb_tln = lesson.questionCount;
          totalCounts.NB[lesson.questionType] += lesson.questionCount;
          break;
        case 'TH':
          if (lesson.questionType === 'TN') row.th_tn = lesson.questionCount;
          if (lesson.questionType === 'DS') row.th_ds = lesson.questionCount;
          if (lesson.questionType === 'TLN') row.th_tln = lesson.questionCount;
          totalCounts.TH[lesson.questionType] += lesson.questionCount;
          break;
        case 'VD':
          if (lesson.questionType === 'TN') row.vd_tn = lesson.questionCount;
          if (lesson.questionType === 'DS') row.vd_ds = lesson.questionCount;
          if (lesson.questionType === 'TLN') row.vd_tln = lesson.questionCount;
          totalCounts.VD[lesson.questionType] += lesson.questionCount;
          break;
      }

      // Tổng cho mỗi loại câu trong dòng
      row.total_tn = (row.nb_tn || 0) + (row.th_tn || 0) + (row.vd_tn || 0);
      row.total_ds = (row.nb_ds || 0) + (row.th_ds || 0) + (row.vd_ds || 0);
      row.total_tln = (row.nb_tln || 0) + (row.th_tln || 0) + (row.vd_tln || 0);

      // Cộng vào tổng toàn bảng
      totalCounts.total_tn += row.total_tn;
      totalCounts.total_ds += row.total_ds;
      totalCounts.total_tln += row.total_tln;
      totalCounts.totalScore += lesson.questionCount;

      tableData.push(row);
    });
  });

  // Thêm tổng cuối bảng
  const totalRow: TableData = {
    chapter: '',
    content: 'TỔNG',
    nb_tn: totalCounts.NB.TN,
    nb_ds: totalCounts.NB.DS,
    nb_tln: totalCounts.NB.TLN,
    th_tn: totalCounts.TH.TN,
    th_ds: totalCounts.TH.DS,
    th_tln: totalCounts.TH.TLN,
    vd_tn: totalCounts.VD.TN,
    vd_ds: totalCounts.VD.DS,
    vd_tln: totalCounts.VD.TLN,
    total_tn: totalCounts.total_tn,
    total_ds: totalCounts.total_ds,
    total_tln: totalCounts.total_tln,
    percentage: `${totalCounts.totalScore}`, // nếu muốn hiển thị tổng điểm
    isSubRow: false,
  };

  tableData.push(totalRow);

  return tableData;
};
