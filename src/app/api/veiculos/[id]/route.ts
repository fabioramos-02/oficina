import { NextResponse } from 'next/server';
import { obterVeiculoPorId, atualizarDadosVeiculo, removerVeiculo } from '@/services/veiculoServico';

interface Contexto {
  params: { id: string };
}

export async function GET(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    const veiculo = await obterVeiculoPorId(id);
    return NextResponse.json(veiculo);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 404 });
  }
}

export async function PUT(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    const body = await request.json();
    const veiculoAtualizado = await atualizarDadosVeiculo(id, body);
    return NextResponse.json(veiculoAtualizado);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    await removerVeiculo(id);
    return NextResponse.json({ mensagem: 'Veículo removido com sucesso.' });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
