import * as repo from '../repositories/ordemServicoRepositorio';
import * as pecaService from './pecaServico';
import { OrdemServico, Prisma, StatusOrdemServico, TipoDesconto } from '@prisma/client';

export interface ItemServicoInput {
  servicoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface ItemPecaInput {
  pecaId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface DadosOrdemServicoInput {
  clienteId: string;
  veiculoId?: string;
  observacoes?: string;
  veiculoKm?: number;
  veiculoCombustivel?: string;
  defeitoRelatado?: string;
  veiculoObservacoes?: string;
  tipoDesconto?: TipoDesconto;
  desconto?: number;
  itemsServicos?: ItemServicoInput[];
  itemsPecas?: ItemPecaInput[];
  status?: StatusOrdemServico;
}

function calcularTotais(dados: {
  itemsServicos?: ItemServicoInput[];
  itemsPecas?: ItemPecaInput[];
  tipoDesconto?: TipoDesconto;
  desconto?: number;
}) {
  const valorServicos = dados.itemsServicos?.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0) || 0;
  const valorPecas = dados.itemsPecas?.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0) || 0;
  const valorSubtotal = valorServicos + valorPecas;
  
  let valorDesconto = 0;
  if (dados.desconto) {
    if (dados.tipoDesconto === TipoDesconto.PORCENTAGEM) {
      valorDesconto = (valorSubtotal * dados.desconto) / 100;
    } else {
      valorDesconto = dados.desconto;
    }
  }

  // Ensure discount doesn't exceed total (or negative total) - User rule: "Descontos não podem gerar valor negativo"
  if (valorDesconto > valorSubtotal) {
      valorDesconto = valorSubtotal;
  }
  
  const valorTotal = valorSubtotal - valorDesconto;

  return { valorServicos, valorPecas, valorSubtotal, valorDesconto, valorTotal };
}

export async function criarNovaOrdemServico(dados: DadosOrdemServicoInput) {
  // 1. Validação de Estoque
  if (dados.itemsPecas && dados.itemsPecas.length > 0) {
    for (const item of dados.itemsPecas) {
      await pecaService.verificarDisponibilidadeEstoque(item.pecaId, item.quantidade);
    }
  }

  const ano = new Date().getFullYear();
  const ultimoNumero = await repo.obterUltimoNumeroPorAno(ano);
  const numero = ultimoNumero + 1;

  const totais = calcularTotais(dados);

  const prismaData: Prisma.OrdemServicoCreateInput = {
    numero,
    ano,
    status: StatusOrdemServico.EM_ANDAMENTO,
    observacoes: dados.observacoes,
    veiculoKm: dados.veiculoKm,
    veiculoCombustivel: dados.veiculoCombustivel,
    defeitoRelatado: dados.defeitoRelatado,
    veiculoObservacoes: dados.veiculoObservacoes,
    tipoDesconto: dados.tipoDesconto || TipoDesconto.VALOR,
    desconto: dados.desconto || 0,
    ...totais,
    cliente: { connect: { id: dados.clienteId } },
    veiculo: dados.veiculoId ? { connect: { id: dados.veiculoId } } : undefined,
    servicos: {
      create: dados.itemsServicos?.map(item => ({
        servico: { connect: { id: item.servicoId } },
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario
      }))
    },
    pecas: {
      create: dados.itemsPecas?.map(item => ({
        peca: { connect: { id: item.pecaId } },
        quantidadeUtilizada: item.quantidade,
        precoUnitarioUtilizado: item.precoUnitario
      }))
    }
  };

  const novaOS = await repo.criarOrdemServico(prismaData);

  // 2. Atualização de Estoque (Baixa)
  if (dados.itemsPecas && dados.itemsPecas.length > 0) {
    try {
      for (const item of dados.itemsPecas) {
        await pecaService.atualizarEstoque(item.pecaId, -item.quantidade);
      }
    } catch (error) {
      console.error('Erro ao baixar estoque após criar OS:', error);
      // Aqui idealmente reverteríamos a criação da OS ou alertaríamos admin.
      // Como não temos transação distribuída fácil, vamos apenas logar por enquanto.
    }
  }

  return novaOS;
}

export async function obterTodasOrdensServico(filtros?: repo.FiltrosOrdemServico) {
  return repo.listarOrdensServico(filtros);
}

export async function obterOrdemServicoPorId(id: string) {
  const os = await repo.buscarOrdemServicoPorId(id);
  if (!os) throw new Error('Ordem de Serviço não encontrada.');
  return os;
}

export async function atualizarStatusOrdemServico(id: string, status: StatusOrdemServico) {
  const os = await repo.buscarOrdemServicoPorId(id);
  if (!os) throw new Error('OS não encontrada');
  
  const data: Prisma.OrdemServicoUpdateInput = { status };
  if (status === StatusOrdemServico.CONCLUIDO) {
      data.dataFinalizacao = new Date();
  }
  
  return repo.atualizarOrdemServico(id, data);
}

export async function atualizarDadosOrdemServico(id: string, dados: Partial<DadosOrdemServicoInput>) {
  const os = await repo.buscarOrdemServicoPorId(id);
  if (!os) throw new Error('OS não encontrada');
  
  if (os.status !== StatusOrdemServico.EM_ANDAMENTO && dados.status !== StatusOrdemServico.EM_ANDAMENTO) {
      // Allow updates if transitioning status, or if status is not changing (e.g. just saving). 
      // But if OS is already concluded/cancelled, and we are NOT reopening it, we should restrict edits?
      // For now, let's allow editing status even if finished, but restrict other fields? 
      // User requirement: "ter a opção de alterar o status dele".
  }

  // Lógica de Estoque para Atualização
  if (dados.itemsPecas) {
    // Calcular Deltas
    const pecasAtuais = os.pecas;
    const pecasNovas = dados.itemsPecas;
    
    const mapaPecas = new Map<string, number>();

    // Subtrai o que já foi usado (será "devolvido" logicamente no calculo do delta)
    pecasAtuais.forEach(p => {
      const qtd = mapaPecas.get(p.pecaId) || 0;
      mapaPecas.set(p.pecaId, qtd - p.quantidadeUtilizada);
    });

    // Adiciona o que será usado
    pecasNovas.forEach(p => {
      const qtd = mapaPecas.get(p.pecaId) || 0;
      mapaPecas.set(p.pecaId, qtd + p.quantidade);
    });

    // Validar Estoque para aumentos (deltas positivos)
    for (const [pecaId, delta] of mapaPecas.entries()) {
      if (delta > 0) {
        // Se delta > 0, significa que o consumo aumentou (ou nova peça entrou)
        // Precisamos verificar se há estoque para esse aumento
        await pecaService.verificarDisponibilidadeEstoque(pecaId, delta);
      }
    }
  }

  const updateData: Prisma.OrdemServicoUpdateInput = {
      observacoes: dados.observacoes,
      veiculoKm: dados.veiculoKm,
      veiculoCombustivel: dados.veiculoCombustivel,
      defeitoRelatado: dados.defeitoRelatado,
      veiculoObservacoes: dados.veiculoObservacoes,
      tipoDesconto: dados.tipoDesconto,
      desconto: dados.desconto,
      status: dados.status,
  };

  if (dados.status === StatusOrdemServico.CONCLUIDO && os.status !== StatusOrdemServico.CONCLUIDO) {
      updateData.dataFinalizacao = new Date();
  } else if (dados.status === StatusOrdemServico.EM_ANDAMENTO && os.status === StatusOrdemServico.CONCLUIDO) {
      updateData.dataFinalizacao = null; // Reopening
  }

  if (dados.itemsServicos || dados.itemsPecas || dados.desconto !== undefined || dados.tipoDesconto !== undefined) {
      const currentItemsServicos = dados.itemsServicos || os.servicos.map(s => ({ servicoId: s.servicoId, quantidade: s.quantidade, precoUnitario: s.precoUnitario }));
      const currentItemsPecas = dados.itemsPecas || os.pecas.map(p => ({ pecaId: p.pecaId, quantidade: p.quantidadeUtilizada, precoUnitario: p.precoUnitarioUtilizado }));
      
      const totais = calcularTotais({
          itemsServicos: currentItemsServicos,
          itemsPecas: currentItemsPecas,
          tipoDesconto: dados.tipoDesconto ?? os.tipoDesconto,
          desconto: dados.desconto ?? os.desconto
      });
      Object.assign(updateData, totais);

      if (dados.itemsServicos) {
          updateData.servicos = {
              deleteMany: {},
              create: dados.itemsServicos.map(item => ({
                  servico: { connect: { id: item.servicoId } },
                  quantidade: item.quantidade,
                  precoUnitario: item.precoUnitario
              }))
          };
      }
      
      if (dados.itemsPecas) {
          updateData.pecas = {
              deleteMany: {},
              create: dados.itemsPecas.map(item => ({
                  peca: { connect: { id: item.pecaId } },
                  quantidadeUtilizada: item.quantidade,
                  precoUnitarioUtilizado: item.precoUnitario
              }))
          };
      }
  }

  const osAtualizada = await repo.atualizarOrdemServico(id, updateData);

  // Aplicar Atualização de Estoque
  if (dados.itemsPecas) {
    const pecasAtuais = os.pecas;
    const pecasNovas = dados.itemsPecas;
    const mapaPecas = new Map<string, number>();

    // Subtrai o que já foi usado (será "devolvido" logicamente no calculo do delta)
    pecasAtuais.forEach(p => {
      const qtd = mapaPecas.get(p.pecaId) || 0;
      mapaPecas.set(p.pecaId, qtd - p.quantidadeUtilizada);
    });

    // Adiciona o que será usado
    pecasNovas.forEach(p => {
      const qtd = mapaPecas.get(p.pecaId) || 0;
      mapaPecas.set(p.pecaId, qtd + p.quantidade);
    });

    for (const [pecaId, delta] of mapaPecas.entries()) {
      if (delta !== 0) {
        // Se delta > 0: consumiu mais, subtrai do estoque (-delta)
        // Se delta < 0: consumiu menos (devolveu), soma ao estoque (-delta torna-se positivo)
        await pecaService.atualizarEstoque(pecaId, -delta);
      }
    }
  }

  return osAtualizada;
}

export async function removerOrdemServico(id: string) {
  // Antes de remover, devolver peças ao estoque
  const os = await repo.buscarOrdemServicoPorId(id);
  if (os && os.pecas.length > 0) {
    for (const item of os.pecas) {
      await pecaService.atualizarEstoque(item.pecaId, item.quantidadeUtilizada);
    }
  }

  return repo.deletarOrdemServico(id);
}
