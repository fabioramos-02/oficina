import React from 'react';
import type { ClientInput, ClientType } from '../../types';
import { inputStyle, labelStyle, sectionStyle, sectionTitleStyle, inputGroupStyle } from './styles';

interface BasicInfoSectionProps {
  formData: ClientInput;
  handleChange: (field: keyof ClientInput, value: string) => void;
  errors: Partial<Record<keyof ClientInput, string>>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ formData, handleChange, errors }) => {
  return (
    <div style={sectionStyle}>
      <h3 style={sectionTitleStyle}>Dados Principais</h3>
      <div style={inputGroupStyle}>
        <div>
          <label style={labelStyle}>Nome *</label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            style={inputStyle(!!errors.nome)}
            placeholder="Nome completo ou Razão Social"
          />
          {errors.nome && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{errors.nome}</span>}
        </div>
        
        <div>
          <label style={labelStyle}>Origem do Cliente</label>
          <select
            value={formData.origemCliente || ''}
            onChange={(e) => handleChange('origemCliente', e.target.value)}
            style={inputStyle(false)}
          >
            <option value="">Selecione uma opção</option>
            <option value="INDICACAO">Indicação</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="GOOGLE">Google</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="OUTROS">Outros</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Tipo de Cliente</label>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="tipoCliente"
                value="PF"
                checked={formData.tipoCliente === 'PF'}
                onChange={(e) => handleChange('tipoCliente', e.target.value as ClientType)}
              />
              <span style={{ fontSize: '0.875rem' }}>Pessoa Física</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="tipoCliente"
                value="PJ"
                checked={formData.tipoCliente === 'PJ'}
                onChange={(e) => handleChange('tipoCliente', e.target.value as ClientType)}
              />
              <span style={{ fontSize: '0.875rem' }}>Pessoa Jurídica</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
