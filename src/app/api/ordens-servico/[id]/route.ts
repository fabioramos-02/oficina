import { NextResponse } from 'next/server';
import { obterOrdemServicoPorId, atualizarDadosOrdemServico, removerOrdemServico } from '@/services/ordemServicoServico';

interface Contexto {
  params: Promise<{ id: string }>;
}

/**
 * @swagger
 * /api/ordens-servico/{id}:
 *   get:
 *     summary: Obtém uma ordem de serviço
 *     description: Busca uma OS pelo seu ID.
 *     tags: [Ordens de Serviço]
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
 *         description: OS encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdemServico'
 *       404:
 *         description: OS não encontrada.
 *       500:
 *         description: Erro interno.
 */
export async function GET(request: Request, context: Contexto) {
  try {
    const { id } = await context.params;
    const os = await obterOrdemServicoPorId(id);
    return NextResponse.json(os);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 404 });
  }
}

/**
 * @swagger
 * /api/ordens-servico/{id}:
 *   put:
 *     summary: Atualiza uma ordem de serviço
 *     description: Atualiza os dados de uma OS existente e recalcula totais se itens mudarem.
 *     tags: [Ordens de Serviço]
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
 *               observacoes:
 *                 type: string
 *               veiculoKm:
 *                 type: number
 *               itemsServicos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     servicoId: {type: string}
 *                     quantidade: {type: number}
 *                     precoUnitario: {type: number}
 *               itemsPecas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     pecaId: {type: string}
 *                     quantidade: {type: number}
 *                     precoUnitario: {type: number}
 *               desconto:
 *                 type: number
 *               tipoDesconto:
 *                 type: string
 *                 enum: [VALOR, PORCENTAGEM]
 *               status:
 *                 type: string
 *                 enum: [EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *     responses:
 *       200:
 *         description: OS atualizada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdemServico'
 *       400:
 *         description: Erro na atualização.
 *       404:
 *         description: OS não encontrada.
 */
export async function PUT(request: Request, context: Contexto) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const osAtualizada = await atualizarDadosOrdemServico(id, body);
    return NextResponse.json(osAtualizada);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/ordens-servico/{id}:
 *   delete:
 *     summary: Remove uma ordem de serviço
 *     description: Exclui uma OS do sistema.
 *     tags: [Ordens de Serviço]
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
 *         description: OS removida.
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
 *         description: OS não encontrada.
 */
export async function DELETE(request: Request, context: Contexto) {
  try {
    const { id } = await context.params;
    await removerOrdemServico(id);
    return NextResponse.json({ mensagem: 'Ordem de Serviço removida com sucesso.' });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
