export interface Peca {
  id: string;
  nome: string;
  descricao?: string;
  categoria?: string;
  codigo: string;
  precoCusto: number;
  precoVenda: number;
  quantidadeEstoque: number;
  
  // Opcionais/Relacionamentos
  ordensServico?: any[]; // Tipo simplificado por enquanto
}

export interface PecaInput {
  nome: string;
  descricao?: string;
  categoria?: string;
  codigo: string;
  precoCusto: number;
  precoVenda: number;
  quantidadeEstoque: number;
}
