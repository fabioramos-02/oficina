import React from 'react';
import type { ClientInput } from '../../types';
import { inputStyle, labelStyle, sectionStyle, sectionTitleStyle } from './styles';

interface AddressSectionProps {
  formData: ClientInput;
  handleChange: (field: keyof ClientInput, value: string) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({ formData, handleChange }) => {
  return (
    <div style={sectionStyle}>
      <h3 style={sectionTitleStyle}>Endereço</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={labelStyle}>CEP</label>
          <input
            type="text"
            value={formData.cep || ''}
            onChange={(e) => handleChange('cep', e.target.value)}
            style={inputStyle(false)}
            placeholder="00000-000"
          />
        </div>
        <div>
          <label style={labelStyle}>Cidade</label>
          <input
            type="text"
            value={formData.cidade || ''}
            onChange={(e) => handleChange('cidade', e.target.value)}
            style={inputStyle(false)}
          />
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={labelStyle}>Logradouro</label>
          <input
            type="text"
            value={formData.logradouro || ''}
            onChange={(e) => handleChange('logradouro', e.target.value)}
            style={inputStyle(false)}
            placeholder="Rua, Av..."
          />
        </div>
        <div>
          <label style={labelStyle}>Número</label>
          <input
            type="text"
            value={formData.numero || ''}
            onChange={(e) => handleChange('numero', e.target.value)}
            style={inputStyle(false)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Complemento</label>
          <input
            type="text"
            value={formData.complemento || ''}
            onChange={(e) => handleChange('complemento', e.target.value)}
            style={inputStyle(false)}
          />
        </div>
        <div>
          <label style={labelStyle}>Bairro</label>
          <input
            type="text"
            value={formData.bairro || ''}
            onChange={(e) => handleChange('bairro', e.target.value)}
            style={inputStyle(false)}
          />
        </div>
        <div>
          <label style={labelStyle}>Estado</label>
          <input
            type="text"
            value={formData.estado || ''}
            onChange={(e) => handleChange('estado', e.target.value)}
            style={inputStyle(false)}
            maxLength={2}
            placeholder="UF"
          />
        </div>
      </div>
    </div>
  );
};
