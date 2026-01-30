import { NextResponse } from 'next/server';
import { criarNovaPeca, obterTodasPecas } from '@/services/pecaServico';

/**
 * @swagger
 * /api/pecas:
 *   get:
 *     summary: Lista todas as peças
 *     description: Retorna uma lista com todas as peças cadastradas no estoque.
 *     tags: [Peças]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de peças recuperada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Peca'
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro interno do servidor.
 */
export async function GET() {
  try {
    const pecas = await obterTodasPecas();
    return NextResponse.json(pecas);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/pecas:
 *   post:
 *     summary: Cria uma nova peça
 *     description: Cadastra uma nova peça no estoque.
 *     tags: [Peças]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, codigo, precoCusto, precoVenda, quantidadeEstoque]
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
 *       201:
 *         description: Peça criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Peca'
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro interno do servidor.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const novaPeca = await criarNovaPeca(body);
    return NextResponse.json(novaPeca, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
