import React, { type ReactNode } from 'react';
import { Menu, MessageSquare } from 'lucide-react';
import '../../styles/global.css';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        backgroundColor: 'var(--surface)',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <button style={{ background: 'none', padding: '8px' }}>
          <Menu size={24} color="var(--primary)" />
        </button>
        
        <h1 style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 600 }}>Início</h1>
        
        <button style={{ background: 'none', padding: '8px' }}>
          <MessageSquare size={24} color="var(--primary)" />
        </button>
      </header>

      <main style={{ flex: 1, padding: '1rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  );
};
