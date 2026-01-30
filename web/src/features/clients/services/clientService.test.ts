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
    email: 'test@example.com',
    telefone: '123456789',
    endereco: 'Test Address'
  };

  it('should fetch all clients', async () => {
    (httpClient.get as any).mockResolvedValue({ data: [mockClient] });

    const result = await clientService.getAll();

    expect(httpClient.get).toHaveBeenCalledWith('/clientes');
    expect(result).toEqual([mockClient]);
  });

  it('should fetch client by id', async () => {
    (httpClient.get as any).mockResolvedValue({ data: mockClient });

    const result = await clientService.getById('1');

    expect(httpClient.get).toHaveBeenCalledWith('/clientes/1');
    expect(result).toEqual(mockClient);
  });

  it('should create a client', async () => {
    (httpClient.post as any).mockResolvedValue({ data: mockClient });

    const input = {
      nome: 'Test Client',
      email: 'test@example.com',
      telefone: '123456789',
      endereco: 'Test Address'
    };

    const result = await clientService.create({
      ...input,
      tipoCliente: 'PF',
      cpf: '000.000.000-00'
    });

    expect(httpClient.post).toHaveBeenCalledWith('/clientes', {
      ...input,
      tipoCliente: 'PF',
      cpf: '000.000.000-00'
    });
    expect(result).toEqual(mockClient);
  });

  it('should update a client', async () => {
    (httpClient.put as any).mockResolvedValue({ data: mockClient });

    const input = {
      nome: 'Updated Client',
      email: 'test@example.com'
    };

    const result = await clientService.update('1', {
      ...input,
      tipoCliente: 'PF',
      cpf: '000.000.000-00'
    });

    expect(httpClient.put).toHaveBeenCalledWith('/clientes/1', {
      ...input,
      tipoCliente: 'PF',
      cpf: '000.000.000-00'
    });
    expect(result).toEqual(mockClient);
  });

  it('should delete a client', async () => {
    (httpClient.delete as any).mockResolvedValue({ data: {} });

    await clientService.delete('1');

    expect(httpClient.delete).toHaveBeenCalledWith('/clientes/1');
  });
});
