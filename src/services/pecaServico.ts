import * as repo from '../repositories/pecaRepositorio';
import { Peca, Prisma } from '@prisma/client';

export async function criarNovaPeca(dados: Prisma.PecaCreateInput): Promise<Peca> {
  const erros: string[] = [];

  if (!dados.nome) erros.push('Nome da peça é obrigatório.');
  if (!dados.codigo) erros.push('Código da peça é obrigatório.');
  
  if (dados.precoCusto < 0) erros.push('Preço de custo não pode ser negativo.');
  if (dados.precoVenda < 0) erros.push('Preço de venda não pode ser negativo.');
  if (dados.quantidadeEstoque < 0) erros.push('Quantidade em estoque não pode ser negativa.');

  // Verifica se código já existe
  const pecaExistente = await repo.buscarPecaPorCodigo(dados.codigo);
  if (pecaExistente) {
    erros.push('Já existe uma peça cadastrada com este código.');
  }

  if (erros.length > 0) {
    throw new Error(`Validação falhou: ${erros.join('; ')}`);
  }

  return repo.criarPeca(dados);
}

export async function obterTodasPecas(): Promise<Peca[]> {
  return repo.listarPecas();
}

export async function obterPecaPorId(id: string): Promise<Peca | null> {
  const peca = await repo.buscarPecaPorId(id);
  if (!peca) throw new Error('Peça não encontrada.');
  return peca;
}

export async function atualizarDadosPeca(id: string, dados: Prisma.PecaUpdateInput): Promise<Peca> {
  // Verifica se a peça existe
  const pecaAtual = await repo.buscarPecaPorId(id);
  if (!pecaAtual) throw new Error('Peça não encontrada.');

  // Se estiver atualizando o código, verifica duplicidade
  if (dados.codigo && typeof dados.codigo === 'string' && dados.codigo !== pecaAtual.codigo) {
    const pecaComCodigo = await repo.buscarPecaPorCodigo(dados.codigo);
    if (pecaComCodigo) {
      throw new Error('Já existe uma outra peça cadastrada com este código.');
    }
  }

  if (dados.precoCusto !== undefined && (dados.precoCusto as number) < 0) {
    throw new Error('Preço de custo não pode ser negativo.');
  }
  if (dados.precoVenda !== undefined && (dados.precoVenda as number) < 0) {
    throw new Error('Preço de venda não pode ser negativo.');
  }
  if (dados.quantidadeEstoque !== undefined && (dados.quantidadeEstoque as number) < 0) {
    throw new Error('Quantidade em estoque não pode ser negativa.');
  }

  return repo.atualizarPeca(id, dados);
}

export async function removerPeca(id: string): Promise<Peca> {
  const peca = await repo.buscarPecaPorId(id);
  if (!peca) throw new Error('Peça não encontrada.');
  
  // Aqui poderia ter verificação se a peça está em uso em alguma Ordem de Serviço
  // Mas por enquanto, vamos permitir a exclusão (o banco pode barrar por FK se configurado, ou cascade)
  // O schema prisma define OrdemServicoPeca, então se tiver registros lá, vai dar erro de FK.
  
  return repo.deletarPeca(id);
}
