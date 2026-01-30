import prisma from '../lib/prisma';
import { Servico, Prisma } from '@prisma/client';

export async function criarServico(dados: Prisma.ServicoCreateInput): Promise<Servico> {
  return prisma.servico.create({ data: dados });
}

export async function listarServicos(): Promise<Servico[]> {
  return prisma.servico.findMany({
    orderBy: { nome: 'asc' }
  });
}

export async function buscarServicoPorId(id: string): Promise<Servico | null> {
  return prisma.servico.findUnique({ where: { id } });
}

export async function atualizarServico(id: string, dados: Prisma.ServicoUpdateInput): Promise<Servico> {
  return prisma.servico.update({ where: { id }, data: dados });
}

export async function deletarServico(id: string): Promise<Servico> {
  return prisma.servico.delete({ where: { id } });
}
