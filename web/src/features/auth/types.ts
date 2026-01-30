export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Internal type for backend communication
export interface BackendLoginResponse {
  token: string;
  usuario: {
    id: string;
    email: string;
    funcao: string;
  };
}
