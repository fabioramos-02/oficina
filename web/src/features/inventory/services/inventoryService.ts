import { httpClient } from '../../../core/api/httpClient';
import type { Peca, PecaInput } from '../types';

export const inventoryService = {
  getAll: async (): Promise<Peca[]> => {
    const { data } = await httpClient.get<Peca[]>('/pecas');
    return data;
  },

  getById: async (id: string): Promise<Peca> => {
    const { data } = await httpClient.get<Peca>(`/pecas/${id}`);
    return data;
  },

  create: async (peca: PecaInput): Promise<Peca> => {
    const { data } = await httpClient.post<Peca>('/pecas', peca);
    return data;
  },

  update: async (id: string, peca: PecaInput): Promise<Peca> => {
    const { data } = await httpClient.put<Peca>(`/pecas/${id}`, peca);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/pecas/${id}`);
  }
};
