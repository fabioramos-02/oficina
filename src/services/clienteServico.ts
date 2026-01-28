import * as repo from '../repositories/clienteRepositorio';
import { Cliente, Prisma } from '@prisma/client';

export async function criarNovoCliente(dados: Prisma.ClienteCreateInput): Promise<Cliente> {
  if (!dados.nome) throw new Error('Nome do cliente é obrigatório.');
  return repo.criarCliente(dados);
}

export async function obterTodosClientes(): Promise<Cliente[]> {
  return repo.listarClientes();
}

export async function obterClientePorId(id: string): Promise<Cliente | null> {
  const cliente = await repo.buscarClientePorId(id);
  if (!cliente) throw new Error('Cliente não encontrado.');
  return cliente;
}

export async function atualizarDadosCliente(id: string, dados: Prisma.ClienteUpdateInput): Promise<Cliente> {
  return repo.atualizarCliente(id, dados);
}

export async function removerCliente(id: string): Promise<Cliente> {
  return repo.deletarCliente(id);
}
