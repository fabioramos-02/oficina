import React from 'react';
import type { ClientInput } from '../../../types';
import { inputStyle, labelStyle, sectionStyle, sectionTitleStyle, inputGroupStyle } from './styles';

interface ContactSectionProps {
  formData: ClientInput;
  handleChange: (field: keyof ClientInput, value: string) => void;
  errors: Partial<Record<keyof ClientInput, string>>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ formData, handleChange, errors }) => {
  return (
    <div style={sectionStyle}>
      <h3 style={sectionTitleStyle}>Contato</h3>
      <div style={inputGroupStyle}>
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            style={inputStyle(!!errors.email)}
            placeholder="email@exemplo.com"
          />
          {errors.email && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{errors.email}</span>}
        </div>

        <div>
          <label style={labelStyle}>Telefone Principal</label>
          <input
            type="text"
            value={formData.telefone || ''}
            onChange={(e) => handleChange('telefone', e.target.value)}
            style={inputStyle(false)}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label style={labelStyle}>Telefone Extra</label>
          <input
            type="text"
            value={formData.telefoneExtra || ''}
            onChange={(e) => handleChange('telefoneExtra', e.target.value)}
            style={inputStyle(false)}
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>
    </div>
  );
};
