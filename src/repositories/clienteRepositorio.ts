import prisma from '../lib/prisma';
import { Cliente, Prisma } from '@prisma/client';

export async function criarCliente(dados: Prisma.ClienteCreateInput): Promise<Cliente> {
  return prisma.cliente.create({ data: dados });
}

export async function listarClientes(): Promise<Cliente[]> {
  return prisma.cliente.findMany({
    include: {
      veiculos: true
    },
    orderBy: {
      nome: 'asc'
    }
  });
}

export async function buscarClientePorId(id: string): Promise<Cliente | null> {
  return prisma.cliente.findUnique({ 
    where: { id },
    include: {
      veiculos: true
    }
  });
}

export async function atualizarCliente(id: string, dados: Prisma.ClienteUpdateInput): Promise<Cliente> {
  return prisma.cliente.update({ where: { id }, data: dados });
}

export async function deletarCliente(id: string): Promise<Cliente> {
  return prisma.cliente.delete({ where: { id } });
}
