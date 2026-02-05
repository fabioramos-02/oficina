# Sistema de Oficina – Gestão de Serviços Automotivos (MVP)

Aplicação web para gestão de oficinas mecânicas: cadastro de clientes e veículos, catálogo de peças e serviços, abertura e acompanhamento de Ordens de Serviço (OS), emissão de comprovantes em PDF com layout fiscal, controle básico de estoque e relatórios operacionais.

⚠️ AVISO LEGAL: Este sistema é um MVP focado em gestão interna e geração de comprovantes. Não substitui sistemas fiscais, não emite NF-e/NFC-e e não possui integração automática com SEFAZ. Use-o como apoio operacional; obrigações fiscais devem ser cumpridas em sistemas próprios.

## 🏗️ Stack Tecnológica
- Frontend: React (Vite) + TypeScript, Tailwind CSS v4, Lucide React
- Backend: Node.js 22, APIs (App Router/Route Handlers)
- Banco de Dados: PostgreSQL
- ORM: Prisma
- Infraestrutura: Docker e Docker Compose
- Documentação de API: next-swagger-doc + swagger-ui-react

## 📐 Arquitetura
- web/: Frontend React (Vite) com estrutura por features
  - core/: API client, rotas, helpers
  - shared/: layout, componentes reutilizáveis
  - features/: páginas e módulos (Serviços, OS, Clientes)
- api/: Handlers de rota (serviços REST/HTTP)
- prisma/: Esquema, migrations e geração de cliente
- docker/: Configuração de containers (PostgreSQL e app)

Princípios:
- Responsabilidade única por módulo e separação clara entre UI, regras de negócio e acesso a dados
- Fluxos de OS com cálculos de totais no backend e inputs amigáveis no frontend
- Layouts de comprovantes seguindo regras visuais A4

## 🧩 Domínio e Relacionamentos
- Cliente: dados pessoais, contato e endereço
- Veículo: modelo, placa, ano, vínculo com Cliente
- Serviço: catálogo com descrição, preço e unidade
- Peça: catálogo com código, estoque e preço
- OrdemServico (OS): agrupa serviços e peças com cálculos
  - Relações via junções: OrdemServicoPeca e OrdemServicoServico
  - Numeração sequencial, totais, descontos e observações
- Oficina: identidade visual e rodapé de comprovantes
  - Campo responsavel para exibir responsável técnico/administrativo no rodapé

Regras conhecidas:
- OS relaciona peças/serviços via tabelas de junção (ItemServico removido)
- Rodapé do PDF deve apresentar responsável da oficina, CNPJ válido e dados de contato
- Datas opcionais devem ser convertidas para null quando input vazio

## 📄 Layout de Comprovantes (PDF)
- Estilo A4 com layout fiscal simplificado
- Fonte Arial, sem cards/sombras/bordas arredondadas
- Faixas cinzas apenas em títulos e total final
- Ordem: Cabeçalho (Logo e dados), Título Cinza, Cliente, Tabelas (Serviços/Peças), Totais, Rodapé

## 🔢 Convenções de Dados (Backend)
- Conversão de datas: strings "YYYY-MM-DD" viram Date ISO
- Strings vazias em campos opcionais Date → null, antes de enviar ao Prisma
- CNPJ: validação estrita para cadastro da Oficina
- Saída do Prisma Client: padrão em node_modules/@prisma/client

## 🧱 UI e Estilo (Frontend)
- Tailwind CSS v4 com configuração via CSS-first
  - Usar @import "tailwindcss"; e @theme em CSS global
  - Plugin @tailwindcss/postcss em postcss.config.js
- Formulários:
  - Layouts em Flex/Grid com separação lógica (logo × campos)
  - Espaçamentos consistentes (gap-6, space-y-2) e foco com ring azul
- Página de Configurações (Oficina):
  - Componentização em seções (Identidade, Endereço, Contato, Rodapé)
  - Upload de logo com drag-and-drop, 5MB máx., imagens

## 🧠 Fluxos Principais
- Abertura de OS:
  - Seleciona Cliente e Veículo
  - Adiciona Serviços e Peças com quantidades
  - Backend calcula subtotais, impostos e total
  - Gera comprovante PDF com layout fiscal
- Catálogo:
  - CRUD de Serviços com CurrencyInput
  - CRUD de Peças com controle de estoque simples
- Relatórios:
  - Faturamento por período, OS em aberto, consumo de peças

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Docker e Docker Compose instalados e em execução
- Node.js 22 instalado

### Passo a Passo Rápido (Setup)
1. Clonar o repositório
   ```bash
   git clone <url-do-repositorio>
   cd oficina
   ```
2. Instalar dependências
   ```bash
   npm install
   ```
3. Subir containers (PostgreSQL + app)
   ```bash
   npm run docker:up
   # ou
   docker-compose -f docker/docker-compose.yml up -d
   ```
4. Preparar banco (Prisma)
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```
5. Ambiente de desenvolvimento
   - Backend/API:
     ```bash
     npm run dev
     ```
   - Frontend (web/):
     ```bash
     cd web
     npm install
     npm run dev
     ```
   - Acesse: http://localhost:3000

### Passo a Passo Manual (alternativa)
1. Instalar dependências
   ```bash
   npm install
   ```
2. Subir containers
   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```
3. Criar tabelas/migrations
   ```bash
   npm run prisma:push
   ```
4. Rodar frontend e backend separadamente conforme necessidade

## 🔧 Comandos Úteis
- Prisma Client: `npm run prisma:generate`
- Push no banco: `npm run prisma:push`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`

## 🔑 Variáveis de Ambiente
- Banco de dados:
  - DATABASE_URL="postgresql://user:pass@localhost:5432/oficina"
- App:
  - NEXT_PUBLIC_API_BASE="http://localhost:3000"
- Upload:
  - MAX_UPLOAD_SIZE=5242880

## 📚 Documentação (Swagger)
- JSON OpenAPI servido em rota de API
- Interface Swagger UI disponível na página /api-doc
- Comentários JSDoc nos handlers para geração automática

## 🧪 Qualidade e CI/CD
- CI usa Node 22
- Instala dependências com `npm install` (evita conflitos de lock entre Windows/Linux)
- Valida Prisma, executa `migrate deploy` em ambientes de deploy
- Deploy em plataformas como Vercel (hooks/CLI), com backend e web

## ❓ Solução de Problemas
Erro: `error during connect: ... open //./pipe/dockerDesktopLinuxEngine`
- Docker Desktop não está rodando
- Solução: abra o Docker Desktop no Windows e aguarde inicialização

Erro: `P1001: Can't reach database server`
- Banco não acessível
- Solução: verifique com `docker ps`. Se não estiver rodando: `npm run docker:up`

Erro de build com Tailwind v4
- Confirme `@tailwindcss/postcss` no postcss.config.js e uso de CSS-first

Datas opcionais rejeitadas no Prisma
- Converta strings vazias para null no serviço antes do client

## 🔮 Evolução Futura
- Integração fiscal (NF-e/NFC-e) via provedores terceiros
- Módulo financeiro (boletos, PIX, conciliação)
- Controle avançado de estoque (múltiplos almoxarifados, lotes)
- App mobile para checklist/recepção
- Integração com catálogos de peças
- Perfis e permissões (admin, mecânico, atendente)
- Webhooks e automações (status da OS, notificações ao cliente)

---
Desenvolvido como MVP para gestão de oficinas mecânicas.
