export interface Workshop {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  enderecoRua: string;
  enderecoNumero: string;
  enderecoBairro: string;
  enderecoCidade: string;
  enderecoEstado: string;
  enderecoCep: string;
  telefone: string;
  email: string;
  instagram?: string;
  facebook?: string;
  descricaoInstitucional?: string;
  logoUrl?: string;
  responsavel?: string;
}

export interface WorkshopInput extends Omit<Workshop, 'id'> {}
