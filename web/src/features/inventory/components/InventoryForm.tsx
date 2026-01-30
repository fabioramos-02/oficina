import React, { useState, useEffect } from 'react';
import type { Peca, PecaInput } from '../types';
import { CurrencyInput } from '../../../shared/components/ui/CurrencyInput';

interface InventoryFormProps {
  initialData?: Peca;
  onSubmit: (data: PecaInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<PecaInput>({
    nome: '',
    codigo: '',
    precoCusto: 0,
    precoVenda: 0,
    quantidadeEstoque: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome,
        codigo: initialData.codigo,
        precoCusto: initialData.precoCusto,
        precoVenda: initialData.precoVenda,
        quantidadeEstoque: initialData.quantidadeEstoque
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof PecaInput, value: string | number) => {
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Nome da Peça *</label>
          <input
            type="text"
            required
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            style={inputStyle}
            placeholder="Ex: Filtro de Óleo"
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Código *</label>
          <input
            type="text"
            required
            value={formData.codigo}
            onChange={(e) => handleChange('codigo', e.target.value)}
            style={inputStyle}
            placeholder="Ex: COD-123"
            disabled={!!initialData} // Código não deve ser alterado na edição para evitar conflitos fáceis, ou permitir com validação backend
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Quantidade em Estoque *</label>
          <input
            type="number"
            required
            min="0"
            value={formData.quantidadeEstoque}
            onChange={(e) => handleChange('quantidadeEstoque', parseInt(e.target.value) || 0)}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <CurrencyInput
            label="Preço de Custo"
            required
            value={Number(formData.precoCusto)}
            onChange={(val) => handleChange('precoCusto', val)}
          />
        </div>

        <div style={formGroupStyle}>
          <CurrencyInput
            label="Preço de Venda"
            required
            value={Number(formData.precoVenda)}
            onChange={(val) => handleChange('precoVenda', val)}
          />
        </div>
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
