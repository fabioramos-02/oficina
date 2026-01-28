import { prisma } from '../lib/prisma';
import { Usuario, Prisma } from '@prisma/client';

/**
 * Cria um novo usuário.
 * @param dados Dados do usuário (Prisma.UsuarioCreateInput).
 */
export async function criarUsuario(dados: Prisma.UsuarioCreateInput): Promise<Usuario> {
  return prisma.usuario.create({
    data: dados,
  });
}

/**
 * Busca um usuário pelo e-mail.
 * @param email E-mail do usuário.
 */
export async function buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
  return prisma.usuario.findUnique({
    where: { email },
  });
}

/**
 * Busca um usuário pelo ID.
 * @param id ID do usuário.
 */
export async function buscarUsuarioPorId(id: string): Promise<Usuario | null> {
  return prisma.usuario.findUnique({
    where: { id },
  });
}
