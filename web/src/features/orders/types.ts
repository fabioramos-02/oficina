export const StatusOrdemServico = {
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  CONCLUIDO: 'CONCLUIDO',
  CANCELADO: 'CANCELADO'
} as const;

export type StatusOrdemServico = typeof StatusOrdemServico[keyof typeof StatusOrdemServico];

export const TipoDesconto = {
  VALOR: 'VALOR',
  PORCENTAGEM: 'PORCENTAGEM'
} as const;

export type TipoDesconto = typeof TipoDesconto[keyof typeof TipoDesconto];

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

export interface OrderInput {
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

export interface Order {
  id: string;
  numero: number;
  ano: number;
  status: StatusOrdemServico;
  dataCriacao: string;
  dataFinalizacao?: string;
  observacoes?: string;
  
  clienteId: string;
  cliente: { id: string; nome: string };
  
  veiculoId?: string;
  veiculo?: { id: string; placa: string; modelo: string; ano?: number };
  
  veiculoKm?: number;
  veiculoCombustivel?: string;
  defeitoRelatado?: string;
  veiculoObservacoes?: string;
  
  valorServicos: number;
  valorPecas: number;
  valorSubtotal: number;
  tipoDesconto: TipoDesconto;
  desconto: number;
  valorDesconto: number;
  valorTotal: number;
  
  servicos: { id: string; servico: { id: string; nome: string }; quantidade: number; precoUnitario: number }[];
  pecas: { id: string; peca: { id: string; nome: string }; quantidadeUtilizada: number; precoUnitarioUtilizado: number }[];
}
