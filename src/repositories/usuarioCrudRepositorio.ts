import { prisma } from '../lib/prisma';
import { Usuario, Prisma } from '@prisma/client';

export async function listarUsuarios(): Promise<Usuario[]> {
  return prisma.usuario.findMany();
}

export async function atualizarUsuario(id: string, dados: Prisma.UsuarioUpdateInput): Promise<Usuario> {
  return prisma.usuario.update({
    where: { id },
    data: dados,
  });
}

export async function deletarUsuario(id: string): Promise<Usuario> {
  return prisma.usuario.delete({
    where: { id },
  });
}
