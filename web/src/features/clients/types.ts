export interface Client {
  id: string;
  nome: string;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
}

export interface ClientInput {
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
}
