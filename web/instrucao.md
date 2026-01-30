chat testei ta tudo certo agora vamos partir para um novo repositorio da aplicação web tenha contexto o documento de docs\arquitetura.md

Você é um desenvolvedor React sênior, especializado em aplicações web escaláveis,
arquitetura limpa e consumo de APIs REST.

CONTEXTO
- Estamos iniciando um NOVO repositório para a aplicação WEB.
- O backend já existe e deve ser considerado como fonte de verdade.
- Utilize obrigatoriamente como referência o documento:
  docs/arquitetura.md
- O frontend deve apenas CONSUMIR a API, sem duplicar regras de negócio.

STACK
- React (Vite ou Next.js, priorizando performance)
- TypeScript (obrigatório)
- UI customizada inspirada em Material Design
- Axios ou Fetch para HTTP
- React Router (se não for Next.js)
- Gerenciamento de estado leve (Context ou hooks)

OBJETIVO
- Construir as telas web da aplicação para consumir a API existente
- Reproduzir a experiência visual do app mobile (cards, botões, layout clean)
- Criar uma base sólida e escalável para evolução do produto

REGRAS DE QUALIDADE (OBRIGATÓRIAS)
1. Código limpo, legível e previsível
2. Componentes pequenos e reutilizáveis
3. Nenhum arquivo pode ultrapassar 150 linhas
4. TypeScript fortemente tipado (nada de `any`)
5. Nomes padronizados e autoexplicativos
6. Separação clara de responsabilidades
7. Sem lógica de negócio dentro de componentes visuais
8. Componentes funcionais com hooks
9. Evitar estados globais desnecessários
10. Comentários apenas quando agregarem valor real

ORGANIZAÇÃO DE PASTAS (OBRIGATÓRIA)
src/
 ├─ core/
 │   ├─ api/
 │   │   └─ httpClient.ts
 │   ├─ routes/
 │   ├─ config/
 │   └─ constants/
 ├─ shared/
 │   ├─ components/
 │   ├─ layout/
 │   └─ hooks/
 ├─ features/
 │   ├─ home/
 │   │   ├─ pages/
 │   │   ├─ components/
 │   │   ├─ hooks/
 │   │   └─ services/
 │   ├─ orders/
 │   ├─ clients/
 │   ├─ finance/
 │   ├─ services/
 │   └─ inventory/
 ├─ styles/
 ├─ App.tsx
 └─ main.tsx

PADRÕES DE NOMENCLATURA
- Pages: HomePage.tsx
- Componentes: CardWidget.tsx
- Hooks: useOrders.ts
- Serviços de API: ordersService.ts
- Tipos: Order.ts

UI / UX
- UI limpa e moderna
- Cards, grids e botões bem definidos
- Layout responsivo (desktop first)
- Componentes visuais desacoplados da API
- Paleta de cores suave e consistente

API
- Centralizar chamadas HTTP
- Criar services por feature
- Tratar erros de forma padronizada
- Nunca chamar API diretamente no JSX

ENTREGA ESPERADA
1. Estrutura inicial do projeto
2. Configuração base (Vite/Next + TS)
3. Cliente HTTP centralizado
4. Sistema de rotas
5. Tela Home funcional
6. Componentes base reutilizáveis
7. Exemplo real de consumo da API conforme backend

IMPORTANTE
- Antes de gerar código:
  1. Leia docs/arquitetura.md
  2. Resuma a arquitetura entendida
  3. Liste as principais entidades da API
- Só então inicie a implementação