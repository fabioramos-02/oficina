import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verificarToken } from '@/utils/jwt';

// Rotas que não exigem autenticação
const rotasPublicas = [
  '/api/auth/login',
  '/api/auth/registro',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Se for rota pública, permite o acesso
  if (rotasPublicas.some((rota) => path.startsWith(rota))) {
    return NextResponse.next();
  }

  // Verifica apenas rotas de API
  if (path.startsWith('/api')) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { erro: 'Token de autenticação não fornecido.' },
        { status: 401 }
      );
    }

    const payload = await verificarToken(token);

    if (!payload) {
      return NextResponse.json(
        { erro: 'Token inválido ou expirado.' },
        { status: 401 }
      );
    }

    // Adiciona dados do usuário aos headers para ser usado nas rotas
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.id);
    requestHeaders.set('x-licenca-id', payload.licencaId);
    requestHeaders.set('x-user-role', payload.funcao);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Para outras rotas (frontend), pode-se implementar redirecionamento
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
