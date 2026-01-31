import prisma from '../lib/prisma';
import { OrdemServico, Prisma, StatusOrdemServico } from '@prisma/client';

export async function criarOrdemServico(dados: Prisma.OrdemServicoCreateInput) {
  return prisma.ordemServico.create({
    data: dados,
    include: {
      cliente: true,
      veiculo: true,
      pecas: { include: { peca: true } },
      servicos: { include: { servico: true } },
    },
  });
}

export interface FiltrosOrdemServico {
  status?: StatusOrdemServico;
  busca?: string;
}

export async function listarOrdensServico(filtros?: FiltrosOrdemServico) {
  const where: Prisma.OrdemServicoWhereInput = {};

  if (filtros?.status) {
    where.status = filtros.status;
  }

  if (filtros?.busca) {
    const termo = filtros.busca;
    const numeroBusca = parseInt(termo);
    
    where.OR = [
      { cliente: { nome: { contains: termo, mode: 'insensitive' } } },
    ];
    
    if (!isNaN(numeroBusca)) {
      where.OR.push({ numero: numeroBusca });
    }
  }

  return prisma.ordemServico.findMany({
    where,
    include: {
      cliente: true,
      veiculo: true,
      pecas: { include: { peca: true } },
      servicos: { include: { servico: true } },
    },
    orderBy: {
      dataCriacao: 'desc',
    },
  });
}

export async function buscarOrdemServicoPorId(id: string) {
  return prisma.ordemServico.findUnique({
    where: { id },
    include: {
      cliente: true,
      veiculo: true,
      pecas: { include: { peca: true } },
      servicos: { include: { servico: true } },
    },
  });
}

export async function atualizarOrdemServico(id: string, dados: Prisma.OrdemServicoUpdateInput) {
  return prisma.ordemServico.update({
    where: { id },
    data: dados,
    include: {
      cliente: true,
      veiculo: true,
      pecas: { include: { peca: true } },
      servicos: { include: { servico: true } },
    },
  });
}

export async function deletarOrdemServico(id: string): Promise<OrdemServico> {
  return prisma.ordemServico.delete({
    where: { id },
  });
}

export async function obterUltimoNumeroPorAno(ano: number): Promise<number> {
  const ultimo = await prisma.ordemServico.findFirst({
    where: { ano },
    orderBy: { numero: 'desc' },
    select: { numero: true },
  });
  return ultimo?.numero || 0;
}
