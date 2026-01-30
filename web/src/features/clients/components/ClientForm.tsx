import React, { useState, useEffect } from 'react';
import type { Client, ClientInput } from '../types';

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: ClientInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<ClientInput>({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });

  const [errors, setErrors] = useState<Partial<ClientInput>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome,
        email: initialData.email || '',
        telefone: initialData.telefone || '',
        endereco: initialData.endereco || ''
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<ClientInput> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Nome *</label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: `1px solid ${errors.nome ? '#EF4444' : '#D1D5DB'}`,
            outline: 'none'
          }}
          placeholder="Nome completo"
        />
        {errors.nome && <span style={{ color: '#EF4444', fontSize: '0.875rem' }}>{errors.nome}</span>}
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: `1px solid ${errors.email ? '#EF4444' : '#D1D5DB'}`,
            outline: 'none'
          }}
          placeholder="email@exemplo.com"
        />
        {errors.email && <span style={{ color: '#EF4444', fontSize: '0.875rem' }}>{errors.email}</span>}
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Telefone</label>
        <input
          type="text"
          value={formData.telefone}
          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #D1D5DB',
            outline: 'none'
          }}
          placeholder="(00) 00000-0000"
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Endereço</label>
        <textarea
          value={formData.endereco}
          onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #D1D5DB',
            outline: 'none',
            minHeight: '80px',
            resize: 'vertical'
          }}
          placeholder="Endereço completo"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #D1D5DB',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#2563EB',
            color: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};
