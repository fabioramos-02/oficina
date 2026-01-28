import { NextResponse } from 'next/server';
import { criarNovoVeiculo, obterTodosVeiculos } from '@/services/veiculoServico';

/**
 * @swagger
 * /api/veiculos:
 *   get:
 *     summary: Lista todos os veículos
 *     description: Retorna uma lista de todos os veículos cadastrados.
 *     tags: [Veículos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de veículos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Veiculo'
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro interno.
 */
export async function GET() {
  try {
    const veiculos = await obterTodosVeiculos();
    return NextResponse.json(veiculos);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/veiculos:
 *   post:
 *     summary: Cria um novo veículo
 *     description: Cadastra um novo veículo para um cliente.
 *     tags: [Veículos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [placa, marca, modelo, clienteId]
 *             properties:
 *               placa:
 *                 type: string
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               ano:
 *                 type: integer
 *               clienteId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Veículo criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Veiculo'
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
    const novoVeiculo = await criarNovoVeiculo(body);
    return NextResponse.json(novoVeiculo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
