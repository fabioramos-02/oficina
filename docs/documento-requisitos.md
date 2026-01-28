# Documento de Requisitos de Software (DRS) - Sistema de Gestão de Oficina Mecânica

## 1. Introdução

O presente documento tem como **propósito** definir os requisitos funcionais e não funcionais para o desenvolvimento de um Sistema de Gestão de Oficina Mecânica. Este sistema será um projeto pessoal/acadêmico, servindo como base para o planejamento e desenvolvimento de um **Produto Mínimo Viável (MVP)**.

O **objetivo do sistema** é fornecer uma ferramenta digital para micro e pequenas oficinas mecânicas, permitindo o gerenciamento eficiente de ordens de serviço, clientes, estoque de peças e o controle financeiro básico.

A concepção inicial deste projeto nasce a partir da **engenharia reversa de protótipos** de sistemas existentes no mercado, como o apresentado na imagem de referência, visando capturar as funcionalidades essenciais e a arquitetura de informação de um sistema de gestão operacional.

## 2. Visão Geral do Sistema

O Sistema de Gestão de Oficina Mecânica é uma aplicação projetada para otimizar os processos operacionais diários de uma oficina. Ele centraliza as informações de pedidos, agendamentos, clientes, estoque e finanças em uma única plataforma.

**Principais Funcionalidades (Módulos):**

| Módulo | Descrição |
| :--- | :--- |
| **Pedidos/OS** | Criação, acompanhamento e finalização de Ordens de Serviço. |
| **Clientes** | Cadastro e histórico de clientes e seus veículos. |
| **Peças & Estoque** | Gestão de inventário de peças, incluindo entrada e baixa automática. |
| **Serviços** | Cadastro de serviços padronizados e seus respectivos preços. |
| **Financeiro** | Controle de contas a pagar e a receber, e fluxo de caixa básico. |
| **Agenda** | Agendamento de serviços e compromissos. |
| **Gestão** | Visualização de relatórios e indicadores de desempenho. |

**Escopo Inicial (MVP) - O que NÃO faz parte:**

Para manter o foco no projeto acadêmico e no MVP, o sistema **não incluirá** no escopo inicial:

*   Integração fiscal oficial (emissão de Nota Fiscal eletrônica - NF-e).
*   Contabilidade completa (lançamentos contábeis, balanço patrimonial).
*   Integração com sistemas de terceiros (ex: fornecedores de peças).
*   Módulo de RH/Folha de pagamento.

O sistema é um **sistema de gestão operacional**, e não um ERP (Enterprise Resource Planning) completo.

## 3. Classes de Usuários

O sistema será utilizado por diferentes perfis dentro da oficina, cada um com níveis de acesso e permissões distintos.

| Classe de Usuário | Descrição | Permissões Chave |
| :--- | :--- | :--- |
| **Administrador/Proprietário** | Usuário principal, responsável pela gestão total da oficina e pela contratação da licença. | Acesso total a todos os módulos, incluindo financeiro, gestão de licença e configurações. |
| **Operador/Funcionário** | Usuário responsável pela execução das tarefas diárias, como atendimento, criação de pedidos e registro de serviços. | Acesso aos módulos de Pedidos, Clientes, Agenda, Peças & Estoque (apenas consulta e baixa). Acesso restrito ou nulo ao Financeiro e Gestão. |

## 4. Requisitos de Software

A próxima seção descreve os requisitos funcionais, detalhando as ações que o sistema deve ser capaz de executar. A seção subsequente descreve os requisitos não funcionais, que especificam critérios de qualidade e restrições de projeto.

## 5. Requisitos Funcionais

Os requisitos funcionais são organizados por módulos, utilizando a linguagem formal **"O sistema DEVE"** para clareza e rastreabilidade.

### 5.1 Autenticação e Licenciamento

| ID | Requisito Funcional |
| :--- | :--- |
| RF-AUT-001 | O sistema DEVE permitir o login de usuários por meio de e-mail e senha. |
| RF-AUT-002 | O sistema DEVE validar se o usuário possui uma licença mensal ativa antes de conceder o acesso. |
| RF-AUT-003 | O sistema DEVE bloquear o acesso do usuário e exibir uma mensagem informativa se a licença estiver expirada ou inativa. |
| RF-AUT-004 | O sistema DEVE permitir que o Administrador gerencie o status da licença (ex: renovação, cancelamento). |

### 5.2 Pedidos/Ordens de Serviço (OS)

| ID | Requisito Funcional |
| :--- | :--- |
| RF-OS-001 | O sistema DEVE permitir a criação de uma nova Ordem de Serviço (OS) a partir do módulo "Pedidos" ou do atalho "Criar novo pedido". |
| RF-OS-002 | O sistema DEVE permitir associar um cliente e um veículo à OS. |
| RF-OS-003 | O sistema DEVE permitir adicionar múltiplos serviços e peças à OS. |
| RF-OS-004 | O sistema DEVE permitir o registro de fotos do trabalho realizado ou do veículo na OS (conforme destaque no protótipo). |
| RF-OS-005 | O sistema DEVE permitir alterar o status da OS (ex: Aberta, Em Serviço, Aguardando Peça, Finalizada). |
| RF-OS-006 | O sistema DEVE gerar um resumo da OS para impressão ou envio ao cliente. |

### 5.3 Clientes

| ID | Requisito Funcional |
| :--- | :--- |
| RF-CLI-001 | O sistema DEVE permitir o cadastro completo de clientes (nome, telefone, e-mail, endereço). |
| RF-CLI-002 | O sistema DEVE permitir o cadastro de múltiplos veículos por cliente (marca, modelo, placa, chassi). |
| RF-CLI-003 | O sistema DEVE exibir o histórico de Ordens de Serviço de um cliente. |

### 5.4 Peças & Estoque

| ID | Requisito Funcional |
| :--- | :--- |
| RF-EST-001 | O sistema DEVE permitir o cadastro de peças com informações como nome, código, preço de custo, preço de venda e quantidade em estoque. |
| RF-EST-002 | O sistema DEVE permitir a entrada manual de novas peças no estoque. |
| RF-EST-003 | O sistema DEVE dar baixa automática na quantidade em estoque quando uma peça for adicionada a uma OS finalizada. |
| RF-EST-004 | O sistema DEVE alertar o usuário quando o estoque de uma peça atingir um nível mínimo configurável. |

### 5.5 Financeiro

| ID | Requisito Funcional |
| :--- | :--- |
| RF-FIN-001 | O sistema DEVE permitir o registro de contas a receber (geradas automaticamente ao finalizar uma OS). |
| RF-FIN-002 | O sistema DEVE permitir o registro manual de outras contas a pagar e a receber. |
| RF-FIN-003 | O sistema DEVE permitir a conciliação e baixa de pagamentos/recebimentos. |
| RF-FIN-004 | O sistema DEVE gerar um relatório de fluxo de caixa simples (entradas vs. saídas) por período. |

## 6. Requisitos Não Funcionais

Os requisitos não funcionais definem as restrições e critérios de qualidade do sistema.

### 6.1 Arquitetura

| ID | Requisito Não Funcional |
| :--- | :--- |
| RNF-ARQ-001 | O sistema DEVE ser implementado com um **Back-end único** que sirva todas as aplicações cliente. |
| RNF-ARQ-002 | O Back-end DEVE expor suas funcionalidades através de **APIs REST** (Representational State Transfer) para comunicação com os Front-ends. |
| RNF-ARQ-003 | Os Front-ends (Web e Mobile) DEVEM ser **desacoplados** do Back-end, comunicando-se exclusivamente via API. |
| RNF-ARQ-004 | O sistema DEVE utilizar um banco de dados relacional (ex: PostgreSQL, MySQL) para persistência de dados. |

### 6.2 Segurança

| ID | Requisito Não Funcional |
| :--- | :--- |
| RNF-SEG-001 | O sistema DEVE garantir que todas as comunicações entre Front-end e Back-end sejam criptografadas (HTTPS/SSL). |
| RNF-SEG-002 | O sistema DEVE armazenar as senhas dos usuários utilizando algoritmos de *hashing* seguros (ex: bcrypt). |
| RNF-SEG-003 | O sistema DEVE implementar controle de acesso baseado em perfil (RBAC - Role-Based Access Control) para restringir funcionalidades de acordo com a classe de usuário (Administrador/Operador). |
| RNF-SEG-004 | O sistema DEVE registrar tentativas de login malsucedidas para fins de auditoria e segurança. |

### 6.3 Usabilidade

| ID | Requisito Não Funcional |
| :--- | :--- |
| RNF-US-001 | O Front-end Web DEVE ser responsivo, adaptando-se a diferentes tamanhos de tela (desktops e tablets). |
| RNF-US-002 | O Front-end Mobile DEVE seguir as diretrizes de design nativas (ou padrões de frameworks como React Native/Flutter) para garantir uma experiência de usuário intuitiva. |
| RNF-US-003 | O sistema DEVE responder a 90% das requisições do usuário em menos de 2 segundos. |

## 7. Histórico de Versões do Documento

| Versão | Data | Autor | Descrição da alteração |
| :--- | :--- | :--- | :--- |
| 1.0 | 2026-01-27 | Fabio Ramos | Criação inicial do Documento de Requisitos de Software (DRS) com base no template fornecido e engenharia reversa do protótipo. |


