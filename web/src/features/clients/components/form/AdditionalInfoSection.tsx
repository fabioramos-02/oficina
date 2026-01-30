import React from 'react';
import type { ClientInput } from '../../types';
import { inputStyle, labelStyle, sectionStyle, sectionTitleStyle, inputGroupStyle } from './styles';

interface AdditionalInfoSectionProps {
  formData: ClientInput;
  handleChange: (field: keyof ClientInput, value: string) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ formData, handleChange }) => {
  return (
    <div style={sectionStyle}>
      <h3 style={sectionTitleStyle}>Detalhes Adicionais</h3>
      <div style={inputGroupStyle}>
        {formData.tipoCliente === 'PF' && (
          <div>
            <label style={labelStyle}>Data de Nascimento</label>
            <input
              type="date"
              value={formData.dataNascimento ? new Date(formData.dataNascimento).toISOString().split('T')[0] : ''}
              onChange={(e) => handleChange('dataNascimento', e.target.value)}
              style={inputStyle(false)}
            />
          </div>
        )}
        
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Anotações Internas</label>
          <textarea
            value={formData.anotacoes || ''}
            onChange={(e) => handleChange('anotacoes', e.target.value)}
            style={{ ...inputStyle(false), minHeight: '80px', resize: 'vertical' }}
            placeholder="Observações sobre o cliente..."
          />
        </div>
      </div>
    </div>
  );
};
