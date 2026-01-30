import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoutes } from './core/routes/AppRoutes';
import './styles/global.css';

import { ToastProvider } from './shared/components/ui/ToastContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  </React.StrictMode>,
);
