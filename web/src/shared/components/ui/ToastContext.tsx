import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '300px',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderLeft: `4px solid ${
                toast.type === 'success' ? '#10B981' : 
                toast.type === 'error' ? '#EF4444' : 
                toast.type === 'warning' ? '#F59E0B' : '#3B82F6'
              }`,
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {toast.type === 'success' && <CheckCircle size={20} color="#10B981" />}
            {toast.type === 'error' && <AlertCircle size={20} color="#EF4444" />}
            {toast.type === 'warning' && <AlertCircle size={20} color="#F59E0B" />}
            {toast.type === 'info' && <Info size={20} color="#3B82F6" />}
            
            <p style={{ margin: 0, flex: 1, fontSize: '0.9rem', color: '#374151' }}>{toast.message}</p>
            
            <button 
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
