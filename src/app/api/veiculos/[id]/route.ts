import { NextResponse } from 'next/server';
import { obterVeiculoPorId, atualizarDadosVeiculo, removerVeiculo } from '@/services/veiculoServico';

interface Contexto {
  params: Promise<{ id: string }>;
}

/**
 * @swagger
 * /api/veiculos/{id}:
 *   get:
 *     summary: Obtém um veículo pelo ID
 *     description: Busca um veículo pelo seu identificador único.
 *     tags: [Veículos]
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
 *         description: Veículo encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Veiculo'
 *       404:
 *         description: Veículo não encontrado.
 *       500:
 *         description: Erro interno.
 */
export async function GET(request: Request, context: Contexto) {
  try {
    const { id } = await context.params;
    const veiculo = await obterVeiculoPorId(id);
    return NextResponse.json(veiculo);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 404 });
  }
}

/**
 * @swagger
 * /api/veiculos/{id}:
 *   put:
 *     summary: Atualiza um veículo
 *     description: Atualiza os dados de um veículo existente.
 *     tags: [Veículos]
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
 *               placa:
 *                 type: string
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               ano:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Veículo atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Veiculo'
 *       400:
 *         description: Erro na atualização.
 *       404:
 *         description: Veículo não encontrado.
 */
export async function PUT(request: Request, context: Contexto) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const veiculoAtualizado = await atualizarDadosVeiculo(id, body);
    return NextResponse.json(veiculoAtualizado);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/veiculos/{id}:
 *   delete:
 *     summary: Remove um veículo
 *     description: Exclui um veículo do sistema.
 *     tags: [Veículos]
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
 *         description: Veículo removido.
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
 *         description: Veículo não encontrado.
 */
export async function DELETE(request: Request, context: Contexto) {
  try {
    const { id } = await context.params;
    await removerVeiculo(id);
    return NextResponse.json({ mensagem: 'Veículo removido com sucesso.' });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
