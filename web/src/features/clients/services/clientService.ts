import { httpClient } from '../../../core/api/httpClient';
import type { Client, ClientInput } from '../types';

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    const { data } = await httpClient.get<Client[]>('/clientes');
    return data;
  },

  getById: async (id: string): Promise<Client> => {
    const { data } = await httpClient.get<Client>(`/clientes/${id}`);
    return data;
  },

  create: async (client: ClientInput): Promise<Client> => {
    const { data } = await httpClient.post<Client>('/clientes', client);
    return data;
  },

  update: async (id: string, client: ClientInput): Promise<Client> => {
    const { data } = await httpClient.put<Client>(`/clientes/${id}`, client);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/clientes/${id}`);
  }
};
