import React, { useState, useEffect } from 'react';
import type { Client, ClientInput, ClientType } from '../types';

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: ClientInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<ClientInput>({
    nome: '',
    tipoCliente: 'PF',
    origemCliente: '',
    cpf: '',
    cnpj: '',
    email: '',
    telefone: '',
    telefoneExtra: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    dataNascimento: '',
    anotacoes: '',
    // Manter compatibilidade com campo antigo se necessário, ou ignorar
    endereco: '' 
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ClientInput, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        tipoCliente: initialData.tipoCliente || 'PF',
        origemCliente: initialData.origemCliente || '',
        cpf: initialData.cpf || '',
        cnpj: initialData.cnpj || '',
        email: initialData.email || '',
        telefone: initialData.telefone || '',
        telefoneExtra: initialData.telefoneExtra || '',
        cep: initialData.cep || '',
        logradouro: initialData.logradouro || '',
        numero: initialData.numero || '',
        complemento: initialData.complemento || '',
        bairro: initialData.bairro || '',
        cidade: initialData.cidade || '',
        estado: initialData.estado || '',
        dataNascimento: initialData.dataNascimento ? new Date(initialData.dataNascimento).toISOString().split('T')[0] : '',
        anotacoes: initialData.anotacoes || '',
        endereco: initialData.endereco || '' // Legacy
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ClientInput, string>> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.tipoCliente === 'PF' && !formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório para Pessoa Física';
    }

    if (formData.tipoCliente === 'PJ' && !formData.cnpj) {
      newErrors.cnpj = 'CNPJ é obrigatório para Pessoa Jurídica';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Limpar campos que não pertencem ao tipo selecionado
      const dataToSend = { ...formData };
      if (dataToSend.tipoCliente === 'PF') {
        dataToSend.cnpj = '';
      } else {
        dataToSend.cpf = '';
        dataToSend.dataNascimento = ''; // Geralmente PJ não tem data de nascimento no cadastro simples
      }
      
      await onSubmit(dataToSend);
    }
  };

  const handleChange = (field: keyof ClientInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const sectionStyle = {
    backgroundColor: '#F9FAFB',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  };

  const sectionTitleStyle = {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  };

  const inputGroupStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
  };

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: `1px solid ${hasError ? '#EF4444' : '#D1D5DB'}`,
    outline: 'none',
    fontSize: '0.875rem'
  });

  const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    fontWeight: 500,
    fontSize: '0.875rem',
    color: '#374151'
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Dados Principais */}
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
            <input
              type="text"
              value={formData.origemCliente || ''}
              onChange={(e) => handleChange('origemCliente', e.target.value)}
              style={inputStyle(false)}
              placeholder="Ex: Indicação, Google, Instagram"
            />
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

      {/* 2. Identificação */}
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

      {/* 3. Contato */}
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

      {/* 4. Endereço Estruturado */}
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

      {/* 5. Detalhes Adicionais */}
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
