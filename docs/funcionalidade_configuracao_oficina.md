# Configuração da Oficina e Identidade Visual

## Manual de Uso

### Acesso
Acesse a página de configurações da oficina através do menu lateral: **Configurações > Oficina** (Rota: `/configuracoes/oficina`).

### Funcionalidades
Esta tela permite configurar os dados principais da oficina que serão utilizados automaticamente em todo o sistema, especialmente na **emissão de notas de serviço (orçamentos)**.

#### 1. Identidade Visual (Logo)
- **Upload de Logo**: Você pode enviar a logo da sua oficina.
- **Formatos aceitos**: JPG, PNG, SVG.
- **Tamanho máximo**: 5MB.
- **Funcionamento**: 
  - Clique na área de upload ou arraste o arquivo.
  - A imagem é carregada imediatamente e uma pré-visualização é exibida.
  - A logo aparecerá no cabeçalho das Notas de Serviço.

#### 2. Informações Básicas
- **Nome Fantasia**: Nome comercial da oficina.
- **Razão Social**: Nome jurídico.
- **CNPJ**: Cadastro Nacional de Pessoa Jurídica (validação automática de formato).
- **Responsável Técnico**: Nome do proprietário ou responsável técnico (aparecerá no rodapé da nota).
- **Descrição Institucional**: Breve texto sobre a oficina (aparece no cabeçalho da nota).

#### 3. Endereço e Contato
- Preencha o endereço completo e dados de contato.
- **Telefone/WhatsApp e E-mail** são obrigatórios para constar nos documentos gerados.
- **Redes Sociais**: Instagram e Facebook (opcionais).

### Salvar Alterações
- O botão "Salvar Alterações" ficará habilitado apenas quando houver mudanças.
- Ao salvar, o sistema valida todos os campos obrigatórios.
- Mensagens de sucesso ou erro serão exibidas no canto da tela.

---

## Documentação Técnica (Refatoração)

### Visão Geral
O módulo de configuração da oficina foi completamente refatorado para atender aos requisitos de UX/UI modernos, validação robusta e upload de arquivos.

### Mudanças Implementadas

1.  **Backend (`src/app/api/upload/route.ts`)**
    - Novo endpoint POST `/api/upload` para upload de imagens.
    - Validação de MIME type (`image/*`) e tamanho (5MB).
    - Armazenamento local em `public/uploads` com renomeação segura (timestamp + sanitize).

2.  **Frontend Service (`web/src/features/workshop/services/workshopService.ts`)**
    - Adicionado método `uploadLogo(file: File): Promise<string>` que envia `FormData` para o backend.

3.  **Componente de Upload (`LogoUpload.tsx`)**
    - Implementado com suporte a Drag & Drop.
    - Feedback visual de loading e preview imediato via `URL.createObjectURL`.
    - Upload assíncrono independente do formulário principal (retorna URL para o estado do form).

4.  **Página de Configurações (`WorkshopSettingsPage.tsx`)**
    - **Gestão de Estado**: Migração de `useState` complexo para `react-hook-form`.
    - **Validação**: Integração com `zod` via `workshopSchema.ts`.
    - **Layout**: 
      - Uso de Grid System responsivo (Mobile First).
      - Separação em Cards temáticos (Identidade, Endereço, Contato).
    - **Feedback**: Skeletons/Loaders durante o fetch inicial e save.

5.  **Testes (`__tests__/WorkshopSettingsPage.test.tsx`)**
    - Testes unitários cobrindo:
      - Carregamento de dados.
      - Validação de campos obrigatórios.
      - Submissão de formulário.

### Schema de Validação (`workshopSchema.ts`)
```typescript
export const workshopSchema = z.object({
  nomeFantasia: z.string().min(1),
  cnpj: z.string().min(14),
  // ... outros campos
});
```
