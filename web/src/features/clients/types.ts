export type ClientType = 'PF' | 'PJ';

export interface Client {
  id: string;
  nome: string;
  tipoCliente: ClientType;
  origemCliente?: string | null;
  
  // Documentos
  cpf?: string | null;
  cnpj?: string | null;
  
  // Contato
  email?: string | null;
  telefone?: string | null;
  telefoneExtra?: string | null;
  
  // Endereço
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  endereco?: string | null; // Mantendo compatibilidade legada se necessário, mas idealmente usar estruturado
  
  // Detalhes
  dataNascimento?: string | null; // Vem como string ISO do backend
  anotacoes?: string | null;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientInput {
  nome: string;
  tipoCliente: ClientType;
  origemCliente?: string;
  
  cpf?: string;
  cnpj?: string;
  
  email?: string;
  telefone?: string;
  telefoneExtra?: string;
  
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  
  dataNascimento?: string;
  anotacoes?: string;
  endereco?: string;
}
