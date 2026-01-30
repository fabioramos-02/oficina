import { httpClient } from '../../../core/api/httpClient';
import type { Servico, ServicoInput } from '../types';

export const serviceService = {
  getAll: async (): Promise<Servico[]> => {
    const { data } = await httpClient.get<Servico[]>('/servicos');
    return data;
  },

  getById: async (id: string): Promise<Servico> => {
    const { data } = await httpClient.get<Servico>(`/servicos/${id}`);
    return data;
  },

  create: async (servico: ServicoInput): Promise<Servico> => {
    const { data } = await httpClient.post<Servico>('/servicos', servico);
    return data;
  },

  update: async (id: string, servico: ServicoInput): Promise<Servico> => {
    const { data } = await httpClient.put<Servico>(`/servicos/${id}`, servico);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/servicos/${id}`);
  }
};
