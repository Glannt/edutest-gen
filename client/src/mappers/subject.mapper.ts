import { SubjectPayload } from '@/types/subject';
import { SubjectInterface } from '@/interface/subject.interface';

/**
 * Chuyển SubjectPayload từ API sang SubjectInterface cho UI table
 */
export const mapSubjectPayloadToInterface = (
  payload: SubjectPayload
): SubjectInterface => ({
  id: payload.id,
  name: payload.name,
  description: payload.description,
  created_at: payload.created_at,
  updated_at: payload.updated_at,
  actions: '', // placeholder – cột hành động được render trong UI
});

/**
 * Map danh sách payload sang interface
 */
export const mapSubjectsPayloadList = (
  list: SubjectPayload[]
): SubjectInterface[] => list.map(mapSubjectPayloadToInterface);

export const mapInterfaceToSubjectPayload = (
  subject: SubjectInterface
): Partial<SubjectPayload> => ({
  name: subject.name,
  description: subject.description,
});
