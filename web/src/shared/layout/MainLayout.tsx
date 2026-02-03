import React, { type ReactNode } from 'react';
import { MessageSquare } from 'lucide-react';
import '../../styles/global.css';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Sidebar - Visible on Desktop */}
      <div className="desktop-sidebar">
         {/* We use CSS media queries in global.css to hide this on mobile */}
        <Sidebar />
      </div>
      
      {/* Mobile/Responsive handling could be done with CSS classes. 
          For this MVP step, I'll render Sidebar directly. 
          To properly handle "desktop only", we usually need a media query in CSS.
          I'll assume the Sidebar component handles its own layout, but here it's a flex item.
      */}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          backgroundColor: 'var(--surface)',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky',
          top: 0,
          zIndex: 90 // Lower than sidebar if sidebar overlaps, but sidebar is side-by-side here
        }}>
          <h1 style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 600 }}>
            {title || 'Sistema de Gestão'}
          </h1>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a 
              href="https://wa.me/67984825955" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center' }}
              title="Fale conosco no WhatsApp"
            >
              <MessageSquare size={20} color="var(--text-secondary)" />
            </a>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
              A
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
