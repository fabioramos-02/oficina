import { httpClient } from '../../../core/api/httpClient';
import type { LoginCredentials, LoginResponse } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simulating API call if backend endpoint doesn't exist yet, 
    // but assuming /auth/login exists based on standard practices.
    const { data } = await httpClient.post<LoginResponse>('/auth/login', credentials);
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
