import { NextResponse } from 'next/server';
import { obterServicoPorId, atualizarDadosServico, removerServico } from '@/services/servicoServico';

interface Contexto {
  params: Promise<{ id: string }>;
}

/**
 * @swagger
 * /api/servicos/{id}:
 *   get:
 *     summary: Obtém um serviço pelo ID
 *     description: Retorna os detalhes de um serviço específico.
 *     tags: [Serviços]
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
 *         description: Serviço encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servico'
 *       404:
 *         description: Serviço não encontrado.
 *       500:
 *         description: Erro interno.
 */
export async function GET(request: Request, context: Contexto) {
  try {
    const { id } = await context.params;
    const servico = await obterServicoPorId(id);
    return NextResponse.json(servico);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 404 });
  }
}

/**
 * @swagger
 * /api/servicos/{id}:
 *   put:
 *     summary: Atualiza um serviço
 *     description: Atualiza os dados de um serviço existente.
 *     tags: [Serviços]
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
 *               preco:
 *                 type: number
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servico'
 *       400:
 *         description: Erro na atualização.
 *       404:
 *         description: Serviço não encontrado.
 */
export async function PUT(request: Request, context: Contexto) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const servicoAtualizado = await atualizarDadosServico(id, body);
    return NextResponse.json(servicoAtualizado);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/servicos/{id}:
 *   delete:
 *     summary: Remove um serviço
 *     description: Remove um serviço do catálogo.
 *     tags: [Serviços]
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
 *         description: Serviço removido com sucesso.
 *       400:
 *         description: Erro ao remover.
 *       404:
 *         description: Serviço não encontrado.
 */
export async function DELETE(request: Request, context: Contexto) {
  try {
    const { id } = await context.params;
    await removerServico(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
