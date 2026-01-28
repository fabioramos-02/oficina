# Casos de Uso do Sistema de Gestão de Oficina Mecânica (MVP)

Este documento detalha os principais Casos de Uso do MVP (Produto Mínimo Viável) do sistema, servindo como base para o desenvolvimento das funcionalidades do Back-end e Front-end.

---

## Caso de Uso – 1. Autenticar no Sistema

**Ator:** Administrador/Operador
**Pré-condição:** O usuário possui credenciais válidas (e-mail e senha) e a licença mensal está ativa.
**Fluxo principal:**
1. O usuário acessa a tela de login.
2. O usuário insere e-mail e senha.
3. O sistema valida as credenciais.
4. O sistema verifica o status da licença mensal.
5. Se as credenciais forem válidas e a licença ativa, o sistema redireciona o usuário para a tela inicial ("Início").
**Pós-condição:** O usuário está autenticado e com acesso liberado ao sistema.
**Fluxo Alternativo A: Credenciais Inválidas**
3a. O sistema informa que o e-mail ou senha estão incorretos.
3b. O usuário permanece na tela de login.
**Fluxo Alternativo B: Licença Expirada/Inativa**
4a. O sistema informa que a licença está expirada ou inativa.
4b. O usuário é impedido de acessar as funcionalidades e é direcionado para uma tela de aviso/renovação (apenas para o Administrador).

---

## Caso de Uso – 2. Cadastrar Novo Cliente

**Ator:** Operador
**Pré-condição:** Usuário autenticado e licença ativa.
**Fluxo principal:**
1. O Operador acessa o módulo "Clientes".
2. O Operador clica em "Novo Cliente".
3. O sistema exibe o formulário de cadastro.
4. O Operador preenche os dados obrigatórios do cliente (Nome, Telefone).
5. O Operador clica em "Salvar".
6. O sistema valida os dados e persiste o novo cliente no banco de dados.
**Pós-condição:** Novo cliente cadastrado e disponível para associação em Ordens de Serviço.

---

## Caso de Uso – 3. Criar Ordem de Serviço

**Ator:** Operador
**Pré-condição:** Usuário autenticado e licença ativa. O cliente e o veículo devem estar cadastrados.
**Fluxo principal:**
1. O Operador acessa o módulo "Pedidos" ou clica em "Criar novo pedido".
2. O sistema exibe o formulário de criação de OS.
3. O Operador seleciona o cliente e o veículo (ou cadastra um novo veículo, se necessário).
4. O Operador adiciona os serviços e as peças necessárias à OS.
5. O sistema calcula o valor total da OS.
6. O Operador clica em "Salvar OS".
**Pós-condição:** OS criada com status **"Aberta"** e registrada no histórico do cliente.

---

## Caso de Uso – 4. Finalizar Ordem de Serviço

**Ator:** Operador
**Pré-condição:** Usuário autenticado e licença ativa. A OS está com status **"Aberta"** ou **"Em Serviço"**.
**Fluxo principal:**
1. O Operador acessa a OS a ser finalizada no módulo "Pedidos".
2. O Operador revisa os serviços e peças utilizados.
3. O Operador altera o status da OS para **"Finalizada"**.
4. O sistema verifica as peças utilizadas na OS.
5. O sistema realiza a **baixa automática** das peças utilizadas no estoque.
6. O sistema registra o valor total da OS como uma **Conta a Receber** no módulo Financeiro (mesmo que simplificado no MVP).
**Pós-condição:** OS com status **"Finalizada"**, estoque atualizado e registro de Conta a Receber criado.

---

## Caso de Uso – 5. Gerenciar Estoque de Peças (MVP)

**Ator:** Operador
**Pré-condição:** Usuário autenticado e licença ativa.
**Fluxo principal:**
1. O Operador acessa o módulo "Peças & Estoque".
2. O Operador clica em "Nova Peça" ou seleciona uma peça existente para edição.
3. O sistema exibe o formulário de cadastro/edição.
4. O Operador preenche/edita os dados da peça (Nome, Código, Preço de Custo, Preço de Venda, Quantidade em Estoque).
5. O Operador clica em "Salvar".
6. O sistema valida os dados e atualiza o registro da peça.
**Pós-condição:** Peça cadastrada/atualizada no estoque.
**Observação:** A baixa de estoque é tratada no Caso de Uso 4. Finalizar Ordem de Serviço.
