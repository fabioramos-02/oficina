import { buscarUsuarioPorEmail, criarUsuario } from '../repositories/usuarioRepositorio';
import { criarLicenca } from '../repositories/licencaRepositorio';
import { gerarHashSenha, compararSenha } from '../utils/senha';
import { gerarToken } from '../utils/jwt';

interface RegistroInput {
  email: string;
  senha: string;
}

interface LoginInput {
  email: string;
  senha: string;
}

interface AuthResultado {
  token: string;
  usuario: {
    id: string;
    email: string;
    funcao: string;
  };
}

/**
 * Registra um novo usuário administrador e cria uma nova licença.
 */
export async function registrarUsuario(input: RegistroInput): Promise<AuthResultado> {
  const usuarioExistente = await buscarUsuarioPorEmail(input.email);
  if (usuarioExistente) {
    throw new Error('E-mail já cadastrado.');
  }

  // 1. Cria a licença
  const licenca = await criarLicenca();

  // 2. Hash da senha
  const hashSenha = await gerarHashSenha(input.senha);

  // 3. Cria o usuário vinculado à licença
  const novoUsuario = await criarUsuario({
    email: input.email,
    hashSenha: hashSenha,
    funcao: 'ADMIN',
    licenca: { connect: { id: licenca.id } },
  });

  // 4. Gera token
  const token = await gerarToken({
    id: novoUsuario.id,
    email: novoUsuario.email,
    funcao: novoUsuario.funcao,
    licencaId: licenca.id,
  });

  return {
    token,
    usuario: {
      id: novoUsuario.id,
      email: novoUsuario.email,
      funcao: novoUsuario.funcao,
    },
  };
}

/**
 * Realiza o login do usuário.
 */
export async function loginUsuario(input: LoginInput): Promise<AuthResultado> {
  const usuario = await buscarUsuarioPorEmail(input.email);
  if (!usuario) {
    throw new Error('Credenciais inválidas.');
  }

  const senhaValida = await compararSenha(input.senha, usuario.hashSenha);
  if (!senhaValida) {
    throw new Error('Credenciais inválidas.');
  }

  const token = await gerarToken({
    id: usuario.id,
    email: usuario.email,
    funcao: usuario.funcao,
    licencaId: usuario.licencaId,
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      funcao: usuario.funcao,
    },
  };
}
