import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, color, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--border-radius)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '120px',
        border: '1px solid transparent'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ 
        backgroundColor: color, 
        padding: '10px', 
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9
      }}>
        <Icon size={24} color="#FFF" />
      </div>
      <span style={{ 
        fontWeight: 600, 
        marginTop: '1rem',
        fontSize: '0.95rem'
      }}>
        {title}
      </span>
    </div>
  );
};
