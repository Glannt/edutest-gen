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

// export const useTableDataMatrix = () => {
//   const structures = useMatrixStore((s) => s.structures);

//   // Lấy levels và questionTypes từ backend
//   const { data: levelsData = [] } = useLevels();
//   const { data: questionTypesData = [] } = useQuestionTypes();

//   console.log(questionTypesData);

//   // Map ra danh sách string để làm header dynamic
//   const levels = levelsData.map((l: any) => l.name);
//   const questionTypes = questionTypesData.map((qt: any) => qt.name);

//   // Lấy danh sách subjects từ structures
//   const subjectsSet = new Set<string>();

//   structures.forEach((item) => subjectsSet.add(item.subject));
//   const subjects = Array.from(subjectsSet);

//   // Tổng theo level/questionType
//   const totalLevelCounts: Record<string, Record<string, number>> = {};

//   levels.forEach((level: any) => {
//     totalLevelCounts[level] = {};
//     questionTypes.forEach((qt) => (totalLevelCounts[level][qt] = 0));
//   });

//   // Tổng theo subject
//   const totalSubjectCounts: Record<string, number> = {};

//   subjects.forEach((sub) => (totalSubjectCounts[sub] = 0));

//   let totalScore = 0;

//   // Gom theo chapter
//   const chapterMap = new Map<string, typeof structures>();

//   structures.forEach((item) => {
//     if (!chapterMap.has(item.chapter)) chapterMap.set(item.chapter, []);
//     chapterMap.get(item.chapter)!.push(item);
//   });

//   const tableData: TableDataMatrix[] = [];

//   chapterMap.forEach((lessons, chapterName) => {
//     lessons.forEach((lesson, idx) => {
//       const row: TableDataMatrix = {
//         chapter: idx === 0 ? chapterName : '',
//         content: lesson.lesson,
//         isSubRow: idx !== 0,
//         rowSpan: idx === 0 ? lessons.length : undefined,
//       };

//       // Gán dynamic level/questionType nếu tồn tại trong danh sách backend
//       if (
//         levels.includes(lesson.level) &&
//         questionTypes.includes(lesson.questionType)
//       ) {
//         row[`${lesson.level}_${lesson.questionType}`] = lesson.questionCount;
//         totalLevelCounts[lesson.level][lesson.questionType] +=
//           lesson.questionCount;
//       }

//       // Gán dynamic subject
//       row[lesson.subject] = lesson.questionCount;
//       totalSubjectCounts[lesson.subject] += lesson.questionCount;

//       // Tổng cho dòng
//       row.totalScore = lesson.questionCount;
//       totalScore += lesson.questionCount;

//       tableData.push(row);
//     });
//   });

//   // Tổng cuối bảng
//   const totalRow: TableDataMatrix = {
//     chapter: '',
//     content: 'TỔNG',
//     isSubRow: false,
//   };

//   levels.forEach((level) => {
//     questionTypes.forEach((qt) => {
//       totalRow[`${level}_${qt}`] = totalLevelCounts[level][qt];
//     });
//   });

//   subjects.forEach((sub) => {
//     totalRow[sub] = totalSubjectCounts[sub];
//   });

//   totalRow.totalScore = totalScore;

//   return {
//     tableData,
//     levels,
//     questionTypes,
//     subjects,
//   };
// };
