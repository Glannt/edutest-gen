import http from '@/libs/http';
import { ApiResponse } from '@/types/api.response';
import { OptionPayload } from '@/types/option';

export const optionService = {
  async getAll(): Promise<OptionPayload[]> {
    const res = await http.get<ApiResponse<OptionPayload[]>>('/options');

    return res.data.data ?? res.data;
  },

  async getById(id: number): Promise<OptionPayload> {
    const res = await http.get<ApiResponse<OptionPayload>>(`/options/${id}`);

    return res.data.data ?? res.data;
  },

  async create(payload: Partial<OptionPayload>): Promise<OptionPayload> {
    const res = await http.post<ApiResponse<OptionPayload>>(
      '/options',
      payload
    );

    return res.data.data ?? res.data;
  },

  async update(
    id: number,
    payload: Partial<OptionPayload>
  ): Promise<OptionPayload> {
    const res = await http.put<ApiResponse<OptionPayload>>(
      `/options/${id}`,
      payload
    );

    return res.data.data ?? res.data;
  },

  async delete(id: number): Promise<void> {
    await http.delete(`/options/${id}`);
  },
};
