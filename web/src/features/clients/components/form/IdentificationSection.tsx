import React from 'react';
import type { ClientInput } from '../../types';
import { inputStyle, labelStyle, sectionStyle, sectionTitleStyle, inputGroupStyle } from './styles';

interface IdentificationSectionProps {
  formData: ClientInput;
  handleChange: (field: keyof ClientInput, value: string) => void;
  errors: Partial<Record<keyof ClientInput, string>>;
}

export const IdentificationSection: React.FC<IdentificationSectionProps> = ({ formData, handleChange, errors }) => {
  return (
    <div style={sectionStyle}>
      <h3 style={sectionTitleStyle}>Identificação</h3>
      <div style={inputGroupStyle}>
        {formData.tipoCliente === 'PF' ? (
          <div>
            <label style={labelStyle}>CPF *</label>
            <input
              type="text"
              value={formData.cpf || ''}
              onChange={(e) => handleChange('cpf', e.target.value)}
              style={inputStyle(!!errors.cpf)}
              placeholder="000.000.000-00"
            />
            {errors.cpf && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{errors.cpf}</span>}
          </div>
        ) : (
          <div>
            <label style={labelStyle}>CNPJ *</label>
            <input
              type="text"
              value={formData.cnpj || ''}
              onChange={(e) => handleChange('cnpj', e.target.value)}
              style={inputStyle(!!errors.cnpj)}
              placeholder="00.000.000/0000-00"
            />
            {errors.cnpj && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{errors.cnpj}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
