# Autenticação Web

Este documento descreve o fluxo de autenticação implementado na aplicação Web.

## Visão Geral

A autenticação utiliza **JWT (JSON Web Tokens)**. O token é obtido via login, armazenado no `localStorage` e enviado automaticamente em todas as requisições HTTP através de interceptors do Axios.

## Componentes Principais

### 1. AuthContext (`src/core/auth/AuthContext.tsx`)
Gerencia o estado global de autenticação (`user`, `isAuthenticated`, `isLoading`).
- Inicializa a sessão verificando o `localStorage`.
- Fornece métodos `login` e `logout`.
- Implementa logout automático após 12 horas ou em caso de erro 401.

### 2. PrivateRoute (`src/core/routes/PrivateRoute.tsx`)
Componente guardião que protege rotas privadas.
- Redireciona para `/login` se o usuário não estiver autenticado.
- Preserva a rota de origem para redirecionamento pós-login.

### 3. HTTP Client (`src/core/api/httpClient.ts`)
Instância centralizada do Axios.
- **Request Interceptor**: Adiciona o header `Authorization: Bearer <token>`.
- **Response Interceptor**: Detecta erros 401 (Unauthorized) e dispara logout global.

## Fluxo de Login

1. Usuário insere credenciais na `LoginPage`.
2. `authService.login` é chamado.
3. API retorna token e dados do usuário.
4. `AuthProvider` salva token e usuário no `localStorage`.
5. Usuário é redirecionado para a página inicial ou rota anterior.

## Como Usar

### Proteger uma Rota
Envolva a rota com `<PrivateRoute />` no arquivo `AppRoutes.tsx`:

```tsx
<Route element={<PrivateRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
</Route>
```

### Acessar Dados do Usuário
Utilize o hook `useAuth` em qualquer componente:

```tsx
import { useAuth } from '../../core/auth/AuthContext';

const MyComponent = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Olá, {user?.name}</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
};
```

## Testes

- **Unitários**: `src/features/auth/services/authService.test.ts` valida a chamada de API.
- **Integração**: `src/core/routes/PrivateRoute.test.tsx` valida a proteção de rotas e redirecionamento.
