import { NextResponse } from 'next/server';
import { criarNovaOrdemServico, obterTodasOrdensServico } from '@/services/ordemServicoServico';

export async function GET() {
  try {
    const ordens = await obterTodasOrdensServico();
    return NextResponse.json(ordens);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // O body deve conter cliente: { connect: { id: ... } } e veiculo: { connect: { id: ... } }
    // ou tratar isso no frontend/serviço
    const novaOS = await criarNovaOrdemServico(body);
    return NextResponse.json(novaOS, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
