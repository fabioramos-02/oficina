export interface Servico {
  id: string;
  nome: string;
  descricao?: string;
  categoria?: string;
  preco: number;
}

export interface ServicoInput {
  nome: string;
  descricao?: string;
  categoria?: string;
  preco: number;
}
