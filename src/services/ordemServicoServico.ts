import * as repo from '../repositories/ordemServicoRepositorio';
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

export async function criarNovaOrdemServico(dados: DadosOrdemServicoInput): Promise<OrdemServico> {
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

  return repo.criarOrdemServico(prismaData);
}

export async function obterTodasOrdensServico(filtros?: repo.FiltrosOrdemServico): Promise<OrdemServico[]> {
  return repo.listarOrdensServico(filtros);
}

export async function obterOrdemServicoPorId(id: string): Promise<OrdemServico | null> {
  const os = await repo.buscarOrdemServicoPorId(id);
  if (!os) throw new Error('Ordem de Serviço não encontrada.');
  return os;
}

export async function atualizarStatusOrdemServico(id: string, status: StatusOrdemServico): Promise<OrdemServico> {
  const os = await repo.buscarOrdemServicoPorId(id);
  if (!os) throw new Error('OS não encontrada');
  
  const data: Prisma.OrdemServicoUpdateInput = { status };
  if (status === StatusOrdemServico.CONCLUIDO) {
      data.dataFinalizacao = new Date();
  }
  
  return repo.atualizarOrdemServico(id, data);
}

export async function atualizarDadosOrdemServico(id: string, dados: Partial<DadosOrdemServicoInput>): Promise<OrdemServico> {
  const os = await repo.buscarOrdemServicoPorId(id);
  if (!os) throw new Error('OS não encontrada');
  
  if (os.status !== StatusOrdemServico.EM_ANDAMENTO) {
      throw new Error('Apenas pedidos em andamento podem ser editados.');
  }

  // Merge existing items with new ones? Or replace? 
  // For simplicity in this "edit" logic, we might need to delete existing relations and recreate if items are passed.
  // Prisma `update` with `set` or `deleteMany` + `create`.
  
  // To keep it simple: If items are passed, we replace them.
  const updateData: Prisma.OrdemServicoUpdateInput = {
      observacoes: dados.observacoes,
      veiculoKm: dados.veiculoKm,
      veiculoCombustivel: dados.veiculoCombustivel,
      defeitoRelatado: dados.defeitoRelatado,
      veiculoObservacoes: dados.veiculoObservacoes,
      tipoDesconto: dados.tipoDesconto,
      desconto: dados.desconto,
  };

  // If items or discount changed, recalculate totals.
  // We need to fetch current items if not provided to recalculate correctly?
  // Or we assume the frontend sends the FULL state of items on save.
  // Let's assume frontend sends full state if editing items.
  
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

  return repo.atualizarOrdemServico(id, updateData);
}

export async function removerOrdemServico(id: string): Promise<OrdemServico> {
  return repo.deletarOrdemServico(id);
}
