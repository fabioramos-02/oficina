import prisma from '../lib/prisma';
import { Oficina, Prisma } from '@prisma/client';

export async function buscarOficinaAtiva(): Promise<Oficina | null> {
  // Assume que a primeira oficina encontrada é a ativa, já que o sistema só deve ter uma.
  return prisma.oficina.findFirst();
}

export async function atualizarOficina(id: string, dados: Prisma.OficinaUpdateInput): Promise<Oficina> {
  return prisma.oficina.update({ where: { id }, data: dados });
}

// Caso seja necessário criar via API (embora o seed já crie)
export async function criarOficina(dados: Prisma.OficinaCreateInput): Promise<Oficina> {
  return prisma.oficina.create({ data: dados });
}
