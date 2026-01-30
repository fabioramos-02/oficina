import { NextResponse } from 'next/server';
import { criarNovoServico, obterTodosServicos } from '@/services/servicoServico';

/**
 * @swagger
 * /api/servicos:
 *   get:
 *     summary: Lista todos os serviços
 *     description: Retorna uma lista com todos os serviços cadastrados.
 *     tags: [Serviços]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de serviços recuperada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servico'
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro interno do servidor.
 */
export async function GET() {
  try {
    const servicos = await obterTodosServicos();
    return NextResponse.json(servicos);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/servicos:
 *   post:
 *     summary: Cria um novo serviço
 *     description: Cadastra um novo serviço no catálogo.
 *     tags: [Serviços]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, preco]
 *             properties:
 *               nome:
 *                 type: string
 *               preco:
 *                 type: number
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servico'
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
    const novoServico = await criarNovoServico(body);
    return NextResponse.json(novoServico, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
