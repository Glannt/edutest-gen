export interface PageResponse<T> {
  content: T[]; // dữ liệu chính
  totalElements: number; // tổng số bản ghi
  totalPages: number; // tổng số trang
  pageNumber: number; // trang hiện tại (0-based)
  pageSize: number; // số phần tử mỗi trang
}
