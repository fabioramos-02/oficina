import { httpClient } from '../../../core/api/httpClient';
import type { LoginCredentials, LoginResponse, BackendLoginResponse } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Map frontend credentials to backend expected payload (email, senha)
    const payload = {
      email: credentials.email,
      senha: credentials.password
    };

    const { data } = await httpClient.post<BackendLoginResponse>('/auth/login', payload);
    
    // Map backend response (usuario, funcao) to frontend domain (user, role)
    return {
      token: data.token,
      user: {
        id: data.usuario.id,
        email: data.usuario.email,
        role: data.usuario.funcao,
        // Backend doesn't return name yet, using email prefix as fallback
        name: data.usuario.email.split('@')[0]
      }
    };
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
