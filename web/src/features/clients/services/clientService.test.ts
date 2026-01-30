import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clientService } from './clientService';
import { httpClient } from '../../../core/api/httpClient';

vi.mock('../../../core/api/httpClient');

describe('clientService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockClient = {
    id: '1',
    nome: 'Test Client',
    email: 'test@test.com',
    telefone: '123456789',
    endereco: 'Test Address'
  };

  it('should get all clients', async () => {
    (httpClient.get as any).mockResolvedValue({ data: [mockClient] });

    const result = await clientService.getAll();

    expect(httpClient.get).toHaveBeenCalledWith('/clientes');
    expect(result).toEqual([mockClient]);
  });

  it('should get client by id', async () => {
    (httpClient.get as any).mockResolvedValue({ data: mockClient });

    const result = await clientService.getById('1');

    expect(httpClient.get).toHaveBeenCalledWith('/clientes/1');
    expect(result).toEqual(mockClient);
  });

  it('should create client', async () => {
    const newClient = {
      nome: 'Test Client',
      email: 'test@test.com'
    };
    (httpClient.post as any).mockResolvedValue({ data: mockClient });

    const result = await clientService.create(newClient);

    expect(httpClient.post).toHaveBeenCalledWith('/clientes', newClient);
    expect(result).toEqual(mockClient);
  });

  it('should update client', async () => {
    const updateData = { nome: 'Updated Name' };
    (httpClient.put as any).mockResolvedValue({ data: { ...mockClient, ...updateData } });

    const result = await clientService.update('1', updateData as any);

    expect(httpClient.put).toHaveBeenCalledWith('/clientes/1', updateData);
    expect(result.nome).toBe('Updated Name');
  });

  it('should delete client', async () => {
    (httpClient.delete as any).mockResolvedValue({});

    await clientService.delete('1');

    expect(httpClient.delete).toHaveBeenCalledWith('/clientes/1');
  });
});
