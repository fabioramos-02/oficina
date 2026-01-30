import prisma from '../lib/prisma';
import { Peca, Prisma } from '@prisma/client';

export async function criarPeca(dados: Prisma.PecaCreateInput): Promise<Peca> {
  return prisma.peca.create({ data: dados });
}

export async function listarPecas(): Promise<Peca[]> {
  return prisma.peca.findMany({
    orderBy: { nome: 'asc' }
  });
}

export async function buscarPecaPorId(id: string): Promise<Peca | null> {
  return prisma.peca.findUnique({ where: { id } });
}

export async function buscarPecaPorCodigo(codigo: string): Promise<Peca | null> {
  return prisma.peca.findUnique({ where: { codigo } });
}

export async function atualizarPeca(id: string, dados: Prisma.PecaUpdateInput): Promise<Peca> {
  return prisma.peca.update({ where: { id }, data: dados });
}

export async function deletarPeca(id: string): Promise<Peca> {
  return prisma.peca.delete({ where: { id } });
}
