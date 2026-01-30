import { NextResponse } from 'next/server';
import { criarNovoCliente, obterTodosClientes } from '@/services/clienteServico';

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     description: Retorna uma lista com todos os clientes cadastrados.
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes recuperada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: Não autorizado. Token ausente ou inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
export async function GET() {
  try {
    const clientes = await obterTodosClientes();
    return NextResponse.json(clientes);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     description: Cadastra um novo cliente no sistema.
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome]
 *             properties:
 *               nome:
 *                 type: string
 *               tipoCliente:
 *                 type: string
 *                 enum: [PF, PJ]
 *               cpf:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               origemCliente:
 *                 type: string
 *                 enum: [INDICACAO, INSTAGRAM, GOOGLE, FACEBOOK, OUTROS]
*               telefone:
 *                 type: string
 *               telefoneExtra:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               cep:
 *                 type: string
 *               logradouro:
 *                 type: string
 *               numero:
 *                 type: string
 *               complemento:
 *                 type: string
 *               bairro:
 *                 type: string
 *               cidade:
 *                 type: string
 *               estado:
 *                 type: string
 *               dataNascimento:
 *                 type: string
 *                 format: date-time
 *               anotacoes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro interno do servidor.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[POST /api/clientes] Payload recebido:', JSON.stringify(body, null, 2));

    const novoCliente = await criarNovoCliente(body);
    return NextResponse.json(novoCliente, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/clientes] Erro:', error);
    
    // Tenta extrair detalhes de erro se for um erro conhecido ou Zod/Prisma
    const errorDetails = error.message || 'Erro desconhecido ao criar cliente';
    const stack = error.stack;

    return NextResponse.json(
      { 
        erro: 'Dados inválidos', 
        detalhes: errorDetails,
        stack: process.env.NODE_ENV === 'development' ? stack : undefined 
      }, 
      { status: 400 }
    );
  }
}
