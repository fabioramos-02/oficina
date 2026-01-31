import { NextResponse } from 'next/server';
import { criarNovaOrdemServico, obterTodasOrdensServico } from '@/services/ordemServicoServico';
import { StatusOrdemServico } from '@prisma/client';

/**
 * @swagger
 * /api/ordens-servico:
 *   get:
 *     summary: Lista todas as ordens de serviço
 *     description: Retorna todas as ordens de serviço cadastradas, com filtros opcionais.
 *     tags: [Ordens de Serviço]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *         description: Filtrar por status
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Filtrar por nome do cliente ou número da OS
 *     responses:
 *       200:
 *         description: Lista de ordens de serviço.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrdemServico'
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro interno.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as StatusOrdemServico | undefined;
    const busca = searchParams.get('busca') || undefined;

    const ordens = await obterTodasOrdensServico({ status, busca });
    return NextResponse.json(ordens);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/ordens-servico:
 *   post:
 *     summary: Cria uma nova ordem de serviço
 *     description: Abre uma nova OS com cálculo automático de totais e numeração sequencial.
 *     tags: [Ordens de Serviço]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clienteId]
 *             properties:
 *               clienteId:
 *                 type: string
 *                 format: uuid
 *               veiculoId:
 *                 type: string
 *                 format: uuid
 *               observacoes:
 *                 type: string
 *               veiculoKm:
 *                 type: number
 *               veiculoCombustivel:
 *                 type: string
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
 *     responses:
 *       201:
 *         description: OS criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdemServico'
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro interno.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const novaOS = await criarNovaOrdemServico(body);
    return NextResponse.json(novaOS, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
