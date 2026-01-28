import * as repo from '../repositories/usuarioCrudRepositorio';
import { buscarUsuarioPorId } from '../repositories/usuarioRepositorio';
import { Usuario, Prisma } from '@prisma/client';
import { gerarHashSenha } from '../utils/senha';

export async function obterTodosUsuarios(): Promise<Usuario[]> {
  return repo.listarUsuarios();
}

export async function obterUsuarioPorId(id: string): Promise<Usuario | null> {
  const usuario = await buscarUsuarioPorId(id);
  if (!usuario) throw new Error('Usuário não encontrado.');
  return usuario;
}

export async function atualizarDadosUsuario(id: string, dados: Prisma.UsuarioUpdateInput): Promise<Usuario> {
  // Se estiver atualizando a senha, precisa fazer o hash
  if (dados.hashSenha && typeof dados.hashSenha === 'string') {
    dados.hashSenha = await gerarHashSenha(dados.hashSenha);
  }
  return repo.atualizarUsuario(id, dados);
}

export async function removerUsuario(id: string): Promise<Usuario> {
  return repo.deletarUsuario(id);
}
