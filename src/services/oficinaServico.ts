import * as repo from '../repositories/oficinaRepositorio';
import { Oficina, Prisma } from '@prisma/client';

export async function obterOficinaAtiva(): Promise<Oficina> {
  const oficina = await repo.buscarOficinaAtiva();
  if (!oficina) {
    throw new Error('Nenhuma oficina cadastrada. Execute o seed ou cadastre uma oficina.');
  }
  return oficina;
}

export async function atualizarDadosOficina(id: string, dados: Prisma.OficinaUpdateInput): Promise<Oficina> {
  const erros: string[] = [];

  // Validações básicas de campos obrigatórios se estiverem sendo atualizados
  if (dados.nomeFantasia !== undefined && !dados.nomeFantasia) erros.push('Nome Fantasia é obrigatório.');
  if (dados.razaoSocial !== undefined && !dados.razaoSocial) erros.push('Razão Social é obrigatória.');
  if (dados.cnpj !== undefined && !dados.cnpj) erros.push('CNPJ é obrigatório.');
  
  if (dados.enderecoRua !== undefined && !dados.enderecoRua) erros.push('Rua é obrigatória.');
  if (dados.enderecoNumero !== undefined && !dados.enderecoNumero) erros.push('Número é obrigatório.');
  if (dados.enderecoBairro !== undefined && !dados.enderecoBairro) erros.push('Bairro é obrigatório.');
  if (dados.enderecoCidade !== undefined && !dados.enderecoCidade) erros.push('Cidade é obrigatória.');
  if (dados.enderecoEstado !== undefined && !dados.enderecoEstado) erros.push('Estado é obrigatório.');
  if (dados.enderecoCep !== undefined && !dados.enderecoCep) erros.push('CEP é obrigatório.');
  
  if (dados.telefone !== undefined && !dados.telefone) erros.push('Telefone é obrigatório.');
  if (dados.email !== undefined && !dados.email) erros.push('E-mail é obrigatório.');

  if (dados.cnpj && typeof dados.cnpj === 'string' && !validarCNPJ(dados.cnpj)) {
    erros.push('CNPJ inválido.');
  }

  if (erros.length > 0) {
    throw new Error(`Validação falhou: ${erros.join('; ')}`);
  }

  // Se estiver atualizando CNPJ, verificar se já existe outra oficina com este CNPJ (embora só deva existir uma)
  // Mas como só tem uma, não faz sentido verificar "outra".

  return repo.atualizarOficina(id, dados);
}

function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj.length !== 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
}
