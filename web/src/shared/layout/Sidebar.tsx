import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  DollarSign, 
  Wrench, 
  Package,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../core/auth/useAuth';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/clientes', label: 'Clientes', icon: Users },
    { path: '/pedidos', label: 'Pedidos', icon: FileText },
    { path: '/agenda', label: 'Agenda', icon: Calendar },
    { path: '/financeiro', label: 'Financeiro', icon: DollarSign },
    { path: '/servicos', label: 'Serviços', icon: Wrench },
    { path: '/estoque', label: 'Estoque', icon: Package },
  ];

  return (
    <aside style={{
      width: '250px',
      backgroundColor: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      left: 0
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wrench size={24} />
          Oficina
        </h2>
      </div>

      <nav style={{ flex: 1, padding: '1rem' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary-foreground)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  fontWeight: isActive ? 500 : 400,
                  transition: 'all 0.2s ease'
                })}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#EF4444', // Red for logout
            cursor: 'pointer',
            fontSize: '1rem',
            borderRadius: '0.5rem',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
};
