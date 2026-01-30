import React from 'react';
import { useLocation } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { Construction } from 'lucide-react';

export const UnderConstructionPage: React.FC = () => {
  const location = useLocation();
  const pageName = location.pathname.substring(1);
  const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <MainLayout>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        textAlign: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ 
          backgroundColor: '#F3F4F6', 
          padding: '2rem', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Construction size={64} color="var(--primary)" />
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{title || 'Página'}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Esta funcionalidade está em desenvolvimento.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};
