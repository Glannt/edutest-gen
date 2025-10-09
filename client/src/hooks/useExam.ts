import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';

import {
  ExamResponse,
  CreateExamRequest,
  AutoGenerateExamRequest,
  AutoGenerateExamListRequest,
} from '@/types/exam';
import { examService } from '@/service/exam.service';
import { PageResponse } from '@/types/page.response';

// Lấy danh sách phân trang
export const usePagedExams = (page = 0, size = 10) =>
  useQuery<PageResponse<ExamResponse>>({
    queryKey: ['exams', page, size],
    queryFn: () => examService.getPaged(page, size),
  });

// Lấy exam theo id
export const useExam = (id?: number) =>
  useQuery<ExamResponse>({
    queryKey: ['exam', id],
    queryFn: () => examService.getById(id!),
    enabled: !!id,
  });

// Tạo exam
export const useCreateExam = (): UseMutationResult<
  ExamResponse,
  Error,
  CreateExamRequest,
  unknown
> => {
  const qc = useQueryClient();

  return useMutation<ExamResponse, Error, CreateExamRequest>({
    mutationFn: (payload: CreateExamRequest) => examService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exams'] }),
  });
};

// Cập nhật exam
export const useUpdateExam = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateExamRequest }) =>
      examService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exams'] }),
  });
};

// Xóa exam
export const useDeleteExam = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => examService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exams'] }),
  });
};

// Tự động sinh exam
export const useAutoGenerateExam = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: AutoGenerateExamRequest) =>
      examService.autoGenerate(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exams'] }),
  });
};

// Tự động sinh nhiều exam
export const useAutoGenerateExamList = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: AutoGenerateExamListRequest) =>
      examService.autoGenerateList(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exams'] }),
  });
};

// Single export
interface ExportSingleParams {
  examId: number;
  format?: 'word' | 'pdf';
}

export const useExportSingleExam = () =>
  useMutation<Blob, Error, ExportSingleParams>({
    mutationFn: ({ examId, format }) =>
      examService.exportSingle(examId, format),
  });

// Multiple export
interface ExportMultipleParams {
  examIds: number[];
  format?: 'word' | 'pdf';
}

export const useExportMultipleExams = () =>
  useMutation<string[], Error, ExportMultipleParams>({
    mutationFn: ({ examIds, format }) =>
      examService.exportMultiple(examIds, format),
  });

// Import file
export const useImportExamFile = () =>
  useMutation<string, Error, File>({
    mutationFn: (file) => examService.importFile(file),
  });
