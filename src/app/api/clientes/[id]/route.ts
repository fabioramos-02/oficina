import { NextResponse } from 'next/server';
import { obterClientePorId, atualizarDadosCliente, removerCliente } from '@/services/clienteServico';

interface Contexto {
  params: { id: string };
}

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtém um cliente pelo ID
 *     description: Retorna os detalhes de um cliente específico.
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
export async function GET(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    const cliente = await obterClientePorId(id);
    return NextResponse.json(cliente);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 404 });
  }
}

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente
 *     description: Atualiza os dados de um cliente existente.
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       200:
 *         description: Cliente atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Erro na atualização.
 *       404:
 *         description: Cliente não encontrado.
 */
export async function PUT(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    const body = await request.json();
    const clienteAtualizado = await atualizarDadosCliente(id, body);
    return NextResponse.json(clienteAtualizado);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     description: Remove um cliente existente.
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente removido com sucesso.
 *       400:
 *         description: Erro ao remover.
 *       404:
 *         description: Cliente não encontrado.
 */
export async function DELETE(request: Request, context: Contexto) {
  try {
    const { id } = context.params;
    await removerCliente(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 400 });
  }
}
