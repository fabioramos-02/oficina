import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../../features/home/pages/HomePage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { PrivateRoute } from './PrivateRoute';
import { AuthProvider } from '../auth/AuthContext';

import { ClientsPage } from '../../features/clients/pages/ClientsPage';
import { InventoryPage } from '../../features/inventory/pages/InventoryPage';
import { ServicesPage } from '../../features/services/pages/ServicesPage';
import { OrdersPage } from '../../features/orders/pages/OrdersPage';
import { UnderConstructionPage } from '../../shared/pages/UnderConstructionPage';

import { WorkshopSettingsPage } from '../../features/workshop/pages/WorkshopSettingsPage';
import { InvoicePage } from '../../features/orders/pages/InvoicePage';

export const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Print Route - No Main Layout if implemented that way, but here we can keep it inside or outside based on needs. 
              InvoicePage handles its own full page view for print. */}
          <Route path="/pedidos/:id/nota" element={<InvoicePage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/clientes" element={<ClientsPage />} />
            
            {/* New Routes with Placeholders */}
            <Route path="/pedidos" element={<OrdersPage />} />
            <Route path="/agenda" element={<UnderConstructionPage />} />
            <Route path="/financeiro" element={<UnderConstructionPage />} />
            <Route path="/servicos" element={<ServicesPage />} />
            <Route path="/estoque" element={<InventoryPage />} />
            
            {/* Settings */}
            <Route path="/configuracoes/oficina" element={<WorkshopSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
