import * as repo from '../repositories/veiculoRepositorio';
import { Veiculo, Prisma } from '@prisma/client';

export async function criarNovoVeiculo(dados: Prisma.VeiculoCreateInput): Promise<Veiculo> {
  if (!dados.placa) throw new Error('Placa do veículo é obrigatória.');
  return repo.criarVeiculo(dados);
}

export async function obterTodosVeiculos(): Promise<Veiculo[]> {
  return repo.listarVeiculos();
}

export async function obterVeiculoPorId(id: string): Promise<Veiculo | null> {
  const veiculo = await repo.buscarVeiculoPorId(id);
  if (!veiculo) throw new Error('Veículo não encontrado.');
  return veiculo;
}

export async function atualizarDadosVeiculo(id: string, dados: Prisma.VeiculoUpdateInput): Promise<Veiculo> {
  return repo.atualizarVeiculo(id, dados);
}

export async function removerVeiculo(id: string): Promise<Veiculo> {
  return repo.deletarVeiculo(id);
}
