import { NextResponse } from 'next/server';
import { criarNovaOrdemServico, obterTodasOrdensServico } from '@/services/ordemServicoServico';

/**
 * @swagger
 * /api/ordens-servico:
 *   get:
 *     summary: Lista todas as ordens de serviço
 *     description: Retorna todas as ordens de serviço cadastradas.
 *     tags: [Ordens de Serviço]
 *     security:
 *       - BearerAuth: []
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
export async function GET() {
  try {
    const ordens = await obterTodasOrdensServico();
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
 *     description: Abre uma nova OS para um cliente e veículo.
 *     tags: [Ordens de Serviço]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cliente, veiculo]
 *             properties:
 *               cliente:
 *                 type: object
 *                 properties:
 *                   connect:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *               veiculo:
 *                 type: object
 *                 properties:
 *                   connect:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *               valorTotal:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [ABERTA, EM_ANDAMENTO, AGUARDANDO_PECA, FINALIZADA, CANCELADA]
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
    // O body deve conter cliente: { connect: { id: ... } } e veiculo: { connect: { id: ... } }
    // ou tratar isso no frontend/serviço
    const novaOS = await criarNovaOrdemServico(body);
    return NextResponse.json(novaOS, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
