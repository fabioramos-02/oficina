import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../../features/home/pages/HomePage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { PrivateRoute } from './PrivateRoute';
import { AuthProvider } from '../auth/AuthContext';

import { ClientsPage } from '../../features/clients/pages/ClientsPage';
import { UnderConstructionPage } from '../../shared/pages/UnderConstructionPage';

export const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/clientes" element={<ClientsPage />} />
            
            {/* New Routes with Placeholders */}
            <Route path="/pedidos" element={<UnderConstructionPage />} />
            <Route path="/agenda" element={<UnderConstructionPage />} />
            <Route path="/financeiro" element={<UnderConstructionPage />} />
            <Route path="/servicos" element={<UnderConstructionPage />} />
            <Route path="/estoque" element={<UnderConstructionPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
