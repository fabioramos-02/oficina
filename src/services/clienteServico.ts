import * as repo from '../repositories/clienteRepositorio';
import { Cliente, Prisma } from '@prisma/client';
export async function criarNovoCliente(dados: Prisma.ClienteCreateInput): Promise<Cliente> {
  const erros: string[] = [];

  if (!dados.nome) erros.push('Nome do cliente é obrigatório.');
  
  if (dados.tipoCliente === 'PF' && !dados.cpf) {
    erros.push('CPF é obrigatório para clientes Pessoa Física.');
  }
  
  if (dados.tipoCliente === 'PJ' && !dados.cnpj) {
    erros.push('CNPJ é obrigatório para clientes Pessoa Jurídica.');
  }

  // Validação do Enum OrigemCliente (se enviado)
  if (dados.origemCliente) {
    const origensValidas = ['INDICACAO', 'INSTAGRAM', 'GOOGLE', 'FACEBOOK', 'OUTROS'];
    if (!origensValidas.includes(dados.origemCliente)) {
      erros.push(`Origem do cliente inválida. Valores permitidos: ${origensValidas.join(', ')}`);
    }
  }

  if (erros.length > 0) {
    throw new Error(`Validação falhou: ${erros.join('; ')}`);
  }

  // Preparação dos dados para salvar
  const dadosParaSalvar = { ...dados } as any;

  // Converter dataNascimento de string (YYYY-MM-DD) para Date ISO
  if (dadosParaSalvar.dataNascimento && typeof dadosParaSalvar.dataNascimento === 'string') {
    const dataStr = dadosParaSalvar.dataNascimento.includes('T')
      ? dadosParaSalvar.dataNascimento
      : `${dadosParaSalvar.dataNascimento}T00:00:00.000Z`;
    dadosParaSalvar.dataNascimento = new Date(dataStr);
  }

  // Remove campos que não existem no banco (como 'endereco' legado)
  if ('endereco' in dadosParaSalvar) {
    delete dadosParaSalvar.endereco;
  }

  return repo.criarCliente(dadosParaSalvar);
}

export async function obterTodosClientes(): Promise<Cliente[]> {
  return repo.listarClientes();
}

export async function obterClientePorId(id: string): Promise<Cliente | null> {
  const cliente = await repo.buscarClientePorId(id);
  if (!cliente) throw new Error('Cliente não encontrado.');
  return cliente;
}

export async function atualizarDadosCliente(id: string, dados: Prisma.ClienteUpdateInput): Promise<Cliente> {
  // Preparação dos dados para atualizar
  const dadosParaSalvar = { ...dados } as any;

  // Converter dataNascimento de string (YYYY-MM-DD) para Date ISO
  if (dadosParaSalvar.dataNascimento && typeof dadosParaSalvar.dataNascimento === 'string') {
    const dataStr = dadosParaSalvar.dataNascimento.includes('T')
      ? dadosParaSalvar.dataNascimento
      : `${dadosParaSalvar.dataNascimento}T00:00:00.000Z`;
    dadosParaSalvar.dataNascimento = new Date(dataStr);
  }

  // Remove campos que não existem no banco
  if ('endereco' in dadosParaSalvar) {
    delete dadosParaSalvar.endereco;
  }
  
  // Validação condicional na atualização (se os campos estiverem presentes)
  if (dados.tipoCliente === 'PF' && dados.cpf === null) {
     // Validações adicionais de atualização se necessário
  }
  
  return repo.atualizarCliente(id, dadosParaSalvar);
}

export async function removerCliente(id: string): Promise<Cliente> {
  return repo.deletarCliente(id);
}
