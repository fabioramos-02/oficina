import { NextResponse } from 'next/server';
import { criarNovoVeiculo, obterTodosVeiculos } from '@/services/veiculoServico';

export async function GET() {
  try {
    const veiculos = await obterTodosVeiculos();
    return NextResponse.json(veiculos);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const novoVeiculo = await criarNovoVeiculo(body);
    return NextResponse.json(novoVeiculo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
