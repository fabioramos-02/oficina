import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Gera o hash de uma senha.
 * @param senha Senha em texto plano.
 * @returns Hash da senha.
 */
export async function gerarHashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, SALT_ROUNDS);
}

/**
 * Compara uma senha em texto plano com um hash.
 * @param senha Senha em texto plano.
 * @param hash Hash armazenado.
 * @returns True se a senha for válida, false caso contrário.
 */
export async function compararSenha(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash);
}
