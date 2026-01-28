import { NextResponse } from 'next/server';
import { obterTodosUsuarios } from '@/services/usuarioServico';

export async function GET() {
  try {
    const usuarios = await obterTodosUsuarios();
    // Remover hash da senha antes de retornar
    const usuariosSemSenha = usuarios.map(u => {
      const { hashSenha, ...rest } = u;
      return rest;
    });
    return NextResponse.json(usuariosSemSenha);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}
