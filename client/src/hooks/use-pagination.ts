import React from 'react';

interface PaginationOptions {
  totalItems: number;
  initialPage?: number;
  initialItemsPerPage?: number;
}

export function usePagination<T>({
  totalItems,
  initialPage = 1,
  initialItemsPerPage = 10,
}: PaginationOptions) {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = React.useState(initialItemsPerPage);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Reset to page 1 if current page is out of bounds
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalItems, itemsPerPage, currentPage, totalPages]);

  // Function to paginate data
  const paginateData = <D extends any>(data: D[]): D[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return data.slice(startIndex, endIndex);
  };

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    paginateData,
  };
}
