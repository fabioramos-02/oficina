import { NextResponse } from 'next/server';
import { obterTodosUsuarios } from '@/services/usuarioServico';

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna todos os usuários cadastrados (sem a senha).
 *     tags: [Usuários]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro interno.
 */
export async function GET() {
  try {
    const usuarios = await obterTodosUsuarios();
    // Remover hash da senha antes de retornar
    const usuariosSemSenha = usuarios.map(u => {
      const { hashSenha, ...rest } = u;
      return rest;
    });
    return NextResponse.json(usuariosSemSenha);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}
