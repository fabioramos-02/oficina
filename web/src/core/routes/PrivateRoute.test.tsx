import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { useAuth } from '../auth/useAuth';
import { vi, describe, it, expect } from 'vitest';

// Mock useAuth
vi.mock('../auth/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('PrivateRoute', () => {
  it('renders outlet when authenticated', () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: true, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    (useAuth as any).mockReturnValue({ isAuthenticated: false, isLoading: false });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<PrivateRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
  
  it('renders loading when isLoading is true', () => {
      (useAuth as any).mockReturnValue({ isAuthenticated: false, isLoading: true });

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/protected" element={<div>Protected Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});
