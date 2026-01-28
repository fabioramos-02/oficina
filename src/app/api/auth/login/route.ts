import { NextResponse } from 'next/server';
import { loginUsuario } from '@/services/authServico';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticação de usuário
 *     description: Realiza o login do usuário e retorna um token JWT.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: E-mail e senha são obrigatórios.
 *       401:
 *         description: Credenciais inválidas.
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

    const resultado = await loginUsuario({ email, senha });

    return NextResponse.json(resultado, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { erro: error.message || 'Erro interno do servidor.' },
      { status: 401 } // Unauthorized
    );
  }
}
