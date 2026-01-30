import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verificarToken } from '@/utils/jwt';

// Rotas que não exigem autenticação
const rotasPublicas = [
  '/api/auth/login',
  '/api/auth/registro',
];

export async function middleware(request: NextRequest) {
  const start = Date.now();
  const path = request.nextUrl.pathname;
  const method = request.method;

  // Log da requisição
  console.log(`[REQ] ${method} ${path} - ${new Date().toISOString()}`);

  // Se for rota pública, permite o acesso
  if (rotasPublicas.some((rota) => path.startsWith(rota))) {
    const response = NextResponse.next();
    const duration = Date.now() - start;
    console.log(`[RES] ${method} ${path} ${response.status} - ${duration}ms`);
    return response;
  }

  // Verifica apenas rotas de API
  if (path.startsWith('/api')) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.warn(`[AUTH FAIL] Token ausente para ${path}`);
      return NextResponse.json(
        { erro: 'Token de autenticação não fornecido.' },
        { status: 401 }
      );
    }

    const payload = await verificarToken(token);

    if (!payload) {
      console.warn(`[AUTH FAIL] Token inválido para ${path}`);
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

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
    const duration = Date.now() - start;
    console.log(`[RES] ${method} ${path} ${response.status} - ${duration}ms`);
    return response;
  }

  // Para outras rotas (frontend)
  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
