import { NextResponse } from 'next/server';
import { registrarUsuario } from '@/services/authServico';

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registro de novo usuário
 *     description: Cria uma nova conta de usuário no sistema.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados inválidos ou usuário já existe.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, senha } = body;

    if (!email || !senha) {
      return NextResponse.json(
        { erro: 'E-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const resultado = await registrarUsuario({ email, senha });

    return NextResponse.json(resultado, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { erro: error.message || 'Erro interno do servidor.' },
      { status: 400 } // Bad Request para erros de validação
    );
  }
}
