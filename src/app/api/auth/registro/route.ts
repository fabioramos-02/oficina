import { NextResponse } from 'next/server';
import { registrarUsuario } from '@/services/authServico';

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
