import { z } from 'zod';

export const workshopSchema = z.object({
  nomeFantasia: z.string().min(1, 'Nome Fantasia é obrigatório'),
  razaoSocial: z.string().min(1, 'Razão Social é obrigatória'),
  cnpj: z.string().min(14, 'CNPJ inválido').max(18, 'CNPJ inválido'), // Simple length check, can add regex
  responsavel: z.string().optional(),
  
  enderecoRua: z.string().min(1, 'Rua é obrigatória'),
  enderecoNumero: z.string().min(1, 'Número é obrigatório'),
  enderecoBairro: z.string().min(1, 'Bairro é obrigatório'),
  enderecoCidade: z.string().min(1, 'Cidade é obrigatória'),
  enderecoEstado: z.string().min(2, 'Estado inválido').max(2, 'Use a sigla (ex: SP)'),
  enderecoCep: z.string().min(8, 'CEP inválido'),
  
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('E-mail inválido'),
  
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  descricaoInstitucional: z.string().optional(),
  
  logoUrl: z.string().optional(),
});

export type WorkshopSchema = z.infer<typeof workshopSchema>;
