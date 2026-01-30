import prisma from '../lib/prisma';
import { OrdemServico, Prisma } from '@prisma/client';

export async function criarOrdemServico(dados: Prisma.OrdemServicoCreateInput): Promise<OrdemServico> {
  return prisma.ordemServico.create({
    data: dados,
    include: {
      cliente: true,
      veiculo: true,
      pecas: true,
      servicos: true,
    },
  });
}

export async function listarOrdensServico(): Promise<OrdemServico[]> {
  return prisma.ordemServico.findMany({
    include: {
      cliente: true,
      veiculo: true,
    },
    orderBy: {
      dataInicio: 'desc',
    },
  });
}

export async function buscarOrdemServicoPorId(id: string): Promise<OrdemServico | null> {
  return prisma.ordemServico.findUnique({
    where: { id },
    include: {
      cliente: true,
      veiculo: true,
      pecas: {
        include: {
          peca: true,
        },
      },
      servicos: {
        include: {
          servico: true,
        },
      },
    },
  });
}

export async function atualizarOrdemServico(id: string, dados: Prisma.OrdemServicoUpdateInput): Promise<OrdemServico> {
  return prisma.ordemServico.update({
    where: { id },
    data: dados,
    include: {
      cliente: true,
      veiculo: true,
    },
  });
}

export async function deletarOrdemServico(id: string): Promise<OrdemServico> {
  return prisma.ordemServico.delete({
    where: { id },
  });
}
