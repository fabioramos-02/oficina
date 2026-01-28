import * as repo from '../repositories/ordemServicoRepositorio';
import { OrdemServico, Prisma } from '@prisma/client';

export async function criarNovaOrdemServico(dados: Prisma.OrdemServicoCreateInput): Promise<OrdemServico> {
  // Validações básicas de negócio podem ser adicionadas aqui
  if (!dados.cliente || !dados.veiculo) {
    throw new Error('Cliente e Veículo são obrigatórios para abrir uma OS.');
  }
  return repo.criarOrdemServico(dados);
}

export async function obterTodasOrdensServico(): Promise<OrdemServico[]> {
  return repo.listarOrdensServico();
}

export async function obterOrdemServicoPorId(id: string): Promise<OrdemServico | null> {
  const os = await repo.buscarOrdemServicoPorId(id);
  if (!os) throw new Error('Ordem de Serviço não encontrada.');
  return os;
}

export async function atualizarStatusOrdemServico(id: string, status: any): Promise<OrdemServico> {
  // Exemplo de atualização específica
  return repo.atualizarOrdemServico(id, { status });
}

export async function atualizarDadosOrdemServico(id: string, dados: Prisma.OrdemServicoUpdateInput): Promise<OrdemServico> {
  return repo.atualizarOrdemServico(id, dados);
}

export async function removerOrdemServico(id: string): Promise<OrdemServico> {
  return repo.deletarOrdemServico(id);
}
