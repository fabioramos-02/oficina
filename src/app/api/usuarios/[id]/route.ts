import { NextResponse } from 'next/server';
import { obterUsuarioPorId, atualizarDadosUsuario, removerUsuario } from '@/services/usuarioServico';

interface Contexto {
  params: { id: string };
}

export async function GET(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    const usuario = await obterUsuarioPorId(id);
    if (usuario) {
      const { hashSenha, ...usuarioSemSenha } = usuario;
      return NextResponse.json(usuarioSemSenha);
    }
    return NextResponse.json(null);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 404 });
  }
}

export async function PUT(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    const body = await request.json();
    const usuarioAtualizado = await atualizarDadosUsuario(id, body);
    const { hashSenha, ...usuarioSemSenha } = usuarioAtualizado;
    return NextResponse.json(usuarioSemSenha);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    await removerUsuario(id);
    return NextResponse.json({ mensagem: 'Usuário removido com sucesso.' });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
