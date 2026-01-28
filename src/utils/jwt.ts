import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret-dev-only';
const ENCODED_SECRET = new TextEncoder().encode(SECRET_KEY);

interface PayloadToken {
  id: string;
  email: string;
  funcao: string;
  licencaId: string;
  [key: string]: any; // Permite outros campos do payload padrão (iat, exp, etc.)
}

/**
 * Gera um token JWT para o usuário.
 * @param payload Dados a serem armazenados no token.
 * @returns Token JWT assinado.
 */
export async function gerarToken(payload: Omit<PayloadToken, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(ENCODED_SECRET);
}

/**
 * Verifica e decodifica um token JWT.
 * @param token Token JWT.
 * @returns Payload decodificado ou null se inválido.
 */
export async function verificarToken(token: string): Promise<PayloadToken | null> {
  try {
    const { payload } = await jwtVerify(token, ENCODED_SECRET);
    return payload as PayloadToken;
  } catch (error) {
    return null;
  }
}
