import React, { useState, useEffect } from 'react';
import type { Servico, ServicoInput } from '../types';
import { CurrencyInput } from '../../../shared/components/ui/CurrencyInput';

interface ServiceFormProps {
  initialData?: Servico;
  onSubmit: (data: ServicoInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<ServicoInput>({
    nome: '',
    preco: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome,
        preco: initialData.preco
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof ServicoInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  // Estilos
  const formGroupStyle = { marginBottom: '16px' };
  const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 500, color: '#374151' };
  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #D1D5DB',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={formGroupStyle}>
        <label style={labelStyle}>Nome do Serviço *</label>
        <input
          type="text"
          required
          value={formData.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          style={inputStyle}
          placeholder="Ex: Troca de Óleo"
        />
      </div>

      <div style={formGroupStyle}>
        <CurrencyInput
          label="Preço"
          required
          value={Number(formData.preco)}
          onChange={(val) => handleChange('preco', val)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #D1D5DB',
            backgroundColor: 'white',
            color: '#374151',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#4F46E5',
            color: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 500,
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};
