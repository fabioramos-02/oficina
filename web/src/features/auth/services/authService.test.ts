import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';
import { httpClient } from '../../../core/api/httpClient';

vi.mock('../../../core/api/httpClient');

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call login endpoint with correct credentials', async () => {
    // Mock backend response structure
    const mockResponse = {
      data: {
        token: 'fake-token',
        usuario: { 
          id: '1', 
          email: 'test@test.com', 
          funcao: 'admin' 
        }
      }
    };
    (httpClient.post as any).mockResolvedValue(mockResponse);

    const credentials = { email: 'test@test.com', password: 'password' };
    const result = await authService.login(credentials);

    // Verify it maps credentials to backend payload (email, senha)
    expect(httpClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@test.com',
      senha: 'password'
    });

    // Verify it maps backend response to frontend domain (user, role)
    expect(result).toEqual({
      token: 'fake-token',
      user: {
        id: '1',
        email: 'test@test.com',
        role: 'admin',
        name: 'test' // 'test@test.com'.split('@')[0]
      }
    });
  });
});
