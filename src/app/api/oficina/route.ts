import { NextResponse } from 'next/server';
import * as servico from '../../../services/oficinaServico';

/**
 * @swagger
 * /api/oficina:
 *   get:
 *     summary: Retorna os dados da oficina ativa
 *     tags: [Oficina]
 *     responses:
 *       200:
 *         description: Dados da oficina
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Oficina'
 *       500:
 *         description: Erro interno
 */
export async function GET() {
  try {
    const oficina = await servico.obterOficinaAtiva();
    return NextResponse.json(oficina);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar oficina.' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/oficina:
 *   put:
 *     summary: Atualiza os dados da oficina ativa
 *     tags: [Oficina]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Oficina'
 *     responses:
 *       200:
 *         description: Oficina atualizada com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno
 */
export async function PUT(request: Request) {
  try {
    const dados = await request.json();
    
    // Primeiro busca a oficina ativa para ter o ID
    const oficinaAtual = await servico.obterOficinaAtiva();
    
    // Atualiza
    const oficinaAtualizada = await servico.atualizarDadosOficina(oficinaAtual.id, dados);
    
    return NextResponse.json(oficinaAtualizada);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar oficina.' },
      { status: 400 }
    );
  }
}
