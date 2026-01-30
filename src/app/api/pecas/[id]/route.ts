import { NextResponse } from 'next/server';
import { obterPecaPorId, atualizarDadosPeca, removerPeca } from '@/services/pecaServico';

interface Contexto {
  params: Promise<{ id: string }>;
}

/**
 * @swagger
 * /api/pecas/{id}:
 *   get:
 *     summary: Obtém uma peça pelo ID
 *     description: Retorna os detalhes de uma peça específica.
 *     tags: [Peças]
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
 *         description: Peça encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Peca'
 *       404:
 *         description: Peça não encontrada.
 *       500:
 *         description: Erro interno.
 */
export async function GET(request: Request, context: Contexto) {
  try {
    const { id } = await context.params;
    const peca = await obterPecaPorId(id);
    return NextResponse.json(peca);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 404 });
  }
}

/**
 * @swagger
 * /api/pecas/{id}:
 *   put:
 *     summary: Atualiza uma peça
 *     description: Atualiza os dados de uma peça existente.
 *     tags: [Peças]
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
 *               nome:
 *                 type: string
 *               codigo:
 *                 type: string
 *               precoCusto:
 *                 type: number
 *               precoVenda:
 *                 type: number
 *               quantidadeEstoque:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Peça atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Peca'
 *       400:
 *         description: Erro na atualização.
 *       404:
 *         description: Peça não encontrada.
 */
export async function PUT(request: Request, context: Contexto) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const pecaAtualizada = await atualizarDadosPeca(id, body);
    return NextResponse.json(pecaAtualizada);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/pecas/{id}:
 *   delete:
 *     summary: Remove uma peça
 *     description: Remove uma peça do estoque.
 *     tags: [Peças]
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
 *         description: Peça removida com sucesso.
 *       400:
 *         description: Erro ao remover.
 *       404:
 *         description: Peça não encontrada.
 */
export async function DELETE(request: Request, context: Contexto) {
  try {
    const { id } = await context.params;
    await removerPeca(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
