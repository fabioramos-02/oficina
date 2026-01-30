import * as repo from '../repositories/servicoRepositorio';
import { Servico, Prisma } from '@prisma/client';

export async function criarNovoServico(dados: Prisma.ServicoCreateInput): Promise<Servico> {
  const erros: string[] = [];

  if (!dados.nome) erros.push('Nome do serviço é obrigatório.');
  if (dados.preco < 0) erros.push('Preço do serviço não pode ser negativo.');

  if (erros.length > 0) {
    throw new Error(`Validação falhou: ${erros.join('; ')}`);
  }

  return repo.criarServico(dados);
}

export async function obterTodosServicos(): Promise<Servico[]> {
  return repo.listarServicos();
}

export async function obterServicoPorId(id: string): Promise<Servico | null> {
  const servico = await repo.buscarServicoPorId(id);
  if (!servico) throw new Error('Serviço não encontrado.');
  return servico;
}

export async function atualizarDadosServico(id: string, dados: Prisma.ServicoUpdateInput): Promise<Servico> {
  const servicoAtual = await repo.buscarServicoPorId(id);
  if (!servicoAtual) throw new Error('Serviço não encontrado.');

  if (dados.preco !== undefined && (dados.preco as number) < 0) {
    throw new Error('Preço do serviço não pode ser negativo.');
  }

  return repo.atualizarServico(id, dados);
}

export async function removerServico(id: string): Promise<Servico> {
  const servico = await repo.buscarServicoPorId(id);
  if (!servico) throw new Error('Serviço não encontrado.');
  
  // TODO: Verificar se serviço está em uso em alguma OS antes de deletar?
  // O banco deve barrar por FK se houver OrdemServicoServico
  
  return repo.deletarServico(id);
}
