import { httpClient } from '../../../core/api/httpClient';
import type { Order, OrderInput, StatusOrdemServico } from '../types';

export const orderService = {
  getAll: async (filters?: { status?: StatusOrdemServico; busca?: string }): Promise<Order[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.busca) params.append('busca', filters.busca);
    
    const { data } = await httpClient.get<Order[]>(`/ordens-servico?${params.toString()}`);
    return data;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await httpClient.get<Order>(`/ordens-servico/${id}`);
    return data;
  },

  create: async (order: OrderInput): Promise<Order> => {
    const { data } = await httpClient.post<Order>('/ordens-servico', order);
    return data;
  },

  update: async (id: string, order: Partial<OrderInput>): Promise<Order> => {
    const { data } = await httpClient.put<Order>(`/ordens-servico/${id}`, order);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/ordens-servico/${id}`);
  }
};
