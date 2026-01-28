import { NextResponse } from 'next/server';
import { criarNovoCliente, obterTodosClientes } from '@/services/clienteServico';

export async function GET() {
  try {
    const clientes = await obterTodosClientes();
    return NextResponse.json(clientes);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const novoCliente = await criarNovoCliente(body);
    return NextResponse.json(novoCliente, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
