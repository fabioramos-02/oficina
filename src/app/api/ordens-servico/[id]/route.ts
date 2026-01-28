import { NextResponse } from 'next/server';
import { obterOrdemServicoPorId, atualizarDadosOrdemServico, removerOrdemServico } from '@/services/ordemServicoServico';

interface Contexto {
  params: { id: string };
}

export async function GET(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    const os = await obterOrdemServicoPorId(id);
    return NextResponse.json(os);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 404 });
  }
}

export async function PUT(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    const body = await request.json();
    const osAtualizada = await atualizarDadosOrdemServico(id, body);
    return NextResponse.json(osAtualizada);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    await removerOrdemServico(id);
    return NextResponse.json({ mensagem: 'Ordem de Serviço removida com sucesso.' });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
