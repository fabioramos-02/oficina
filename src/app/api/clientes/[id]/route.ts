import { NextResponse } from 'next/server';
import { obterClientePorId, atualizarDadosCliente, removerCliente } from '@/services/clienteServico';

interface Contexto {
  params: { id: string };
}

export async function GET(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    const cliente = await obterClientePorId(id);
    return NextResponse.json(cliente);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 404 });
  }
}

export async function PUT(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    const body = await request.json();
    const clienteAtualizado = await atualizarDadosCliente(id, body);
    return NextResponse.json(clienteAtualizado);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    await removerCliente(id);
    return NextResponse.json({ mensagem: 'Cliente removido com sucesso.' });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
