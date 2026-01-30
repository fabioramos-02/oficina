import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';
import { httpClient } from '../../../core/api/httpClient';

vi.mock('../../../core/api/httpClient');

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call login endpoint with correct credentials', async () => {
    const mockResponse = {
      data: {
        token: 'fake-token',
        user: { id: '1', name: 'Test', email: 'test@test.com', role: 'admin' }
      }
    };
    (httpClient.post as any).mockResolvedValue(mockResponse);

    const credentials = { email: 'test@test.com', password: 'password' };
    const result = await authService.login(credentials);

    expect(httpClient.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(result).toEqual(mockResponse.data);
  });
});
