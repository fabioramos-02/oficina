import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', // define where to look for the routes
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Sistema de Gestão de Oficina Mecânica',
        version: '1.0.0',
        description: 'Documentação da API do Sistema de Gestão de Oficina Mecânica, desenvolvida com Next.js e Prisma.',
      },
      servers: [
        {
          url: baseUrl,
          description: 'Servidor',
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          // Os schemas serão definidos aqui ou via JSDoc nas rotas, 
          // mas definir os baseados no Prisma aqui ajuda na reutilização.
          Cliente: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              nome: { type: 'string' },
              tipoCliente: { type: 'string', enum: ['PF', 'PJ'] },
              origemCliente: { type: 'string', enum: ['INDICACAO', 'INSTAGRAM', 'GOOGLE', 'FACEBOOK', 'OUTROS'] },
              cpf: { type: 'string' },
              cnpj: { type: 'string' },
              email: { type: 'string', format: 'email' },
              telefone: { type: 'string' },
              telefoneExtra: { type: 'string' },
              cep: { type: 'string' },
              logradouro: { type: 'string' },
              numero: { type: 'string' },
              complemento: { type: 'string' },
              bairro: { type: 'string' },
              cidade: { type: 'string' },
              estado: { type: 'string' },
              dataNascimento: { type: 'string', format: 'date-time', nullable: true },
              anotacoes: { type: 'string' },
              endereco: { type: 'string' }, // Legacy
            },
          },
          Veiculo: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              placa: { type: 'string' },
              marca: { type: 'string' },
              modelo: { type: 'string' },
              ano: { type: 'integer' },
              clienteId: { type: 'string', format: 'uuid' },
            },
          },
          Peca: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              nome: { type: 'string' },
              codigo: { type: 'string' },
              precoCusto: { type: 'number', format: 'float' },
              precoVenda: { type: 'number', format: 'float' },
              quantidadeEstoque: { type: 'integer' },
            },
          },
          Servico: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              nome: { type: 'string' },
              preco: { type: 'number', format: 'float' },
            },
          },
          OrdemServico: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              status: { 
                type: 'string', 
                enum: ['ABERTA', 'EM_ANDAMENTO', 'AGUARDANDO_PECA', 'FINALIZADA', 'CANCELADA'] 
              },
              dataInicio: { type: 'string', format: 'date-time' },
              dataFim: { type: 'string', format: 'date-time' },
              valorTotal: { type: 'number', format: 'float' },
              clienteId: { type: 'string', format: 'uuid' },
              veiculoId: { type: 'string', format: 'uuid' },
            },
          },
          Usuario: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              email: { type: 'string', format: 'email' },
              funcao: { type: 'string', enum: ['ADMIN', 'OPERADOR'] },
              licencaId: { type: 'string', format: 'uuid' },
            },
          },
          LoginRequest: {
            type: 'object',
            required: ['email', 'senha'],
            properties: {
              email: { type: 'string', format: 'email' },
              senha: { type: 'string' },
            },
          },
          LoginResponse: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              usuario: { $ref: '#/components/schemas/Usuario' },
            },
          },
        },
      },
      security: [], // Segurança global vazia por padrão, aplicar por rota
    },
  });
  return spec;
};
