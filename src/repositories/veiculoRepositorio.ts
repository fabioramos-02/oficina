import prisma from '../lib/prisma';
import { Veiculo, Prisma } from '@prisma/client';

export async function criarVeiculo(dados: Prisma.VeiculoCreateInput): Promise<Veiculo> {
  return prisma.veiculo.create({ data: dados });
}

export async function listarVeiculos(): Promise<Veiculo[]> {
  return prisma.veiculo.findMany({ include: { cliente: true } });
}

export async function buscarVeiculoPorId(id: string): Promise<Veiculo | null> {
  return prisma.veiculo.findUnique({ where: { id }, include: { cliente: true } });
}

export async function atualizarVeiculo(id: string, dados: Prisma.VeiculoUpdateInput): Promise<Veiculo> {
  return prisma.veiculo.update({ where: { id }, data: dados });
}

export async function deletarVeiculo(id: string): Promise<Veiculo> {
  return prisma.veiculo.delete({ where: { id } });
}
