import { NextResponse } from 'next/server';
import { obterUsuarioPorId, atualizarDadosUsuario, removerUsuario } from '@/services/usuarioServico';

interface Contexto {
  params: { id: string };
}

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtém um usuário pelo ID
 *     description: Retorna os dados de um usuário específico (sem senha).
 *     tags: [Usuários]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Usuário encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno.
 */
export async function GET(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    const usuario = await obterUsuarioPorId(id);
    if (usuario) {
      const { hashSenha, ...usuarioSemSenha } = usuario;
      return NextResponse.json(usuarioSemSenha);
    }
    return NextResponse.json(null);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 404 });
  }
}

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     description: Atualiza dados de um usuário (e-mail, função).
 *     tags: [Usuários]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               funcao:
 *                 type: string
 *                 enum: [ADMIN, OPERADOR]
 *     responses:
 *       200:
 *         description: Usuário atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Erro na atualização.
 *       404:
 *         description: Usuário não encontrado.
 */
export async function PUT(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    const body = await request.json();
    const usuarioAtualizado = await atualizarDadosUsuario(id, body);
    const { hashSenha, ...usuarioSemSenha } = usuarioAtualizado;
    return NextResponse.json(usuarioSemSenha);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     description: Exclui um usuário do sistema.
 *     tags: [Usuários]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Usuário removido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *       400:
 *         description: Erro ao remover.
 *       404:
 *         description: Usuário não encontrado.
 */
export async function DELETE(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    await removerUsuario(id);
    return NextResponse.json({ mensagem: 'Usuário removido com sucesso.' });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
