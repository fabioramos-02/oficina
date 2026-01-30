import React, { useState, useEffect } from 'react';
import type { Client, ClientInput } from '../types';
import { BasicInfoSection } from './form/BasicInfoSection';
import { IdentificationSection } from './form/IdentificationSection';
import { ContactSection } from './form/ContactSection';
import { AddressSection } from './form/AddressSection';
import { AdditionalInfoSection } from './form/AdditionalInfoSection';

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
    origemCliente: undefined,
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
        origemCliente: initialData.origemCliente || undefined,
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
      
      // Converter string vazia para undefined no enum
      if (dataToSend.origemCliente === '' as any) {
        dataToSend.origemCliente = undefined;
      }

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
    setFormData(prev => ({ ...prev, [field]: value as any }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <BasicInfoSection formData={formData} handleChange={handleChange} errors={errors} />
      
      <IdentificationSection formData={formData} handleChange={handleChange} errors={errors} />
      
      <ContactSection formData={formData} handleChange={handleChange} errors={errors} />
      
      <AddressSection formData={formData} handleChange={handleChange} />
      
      <AdditionalInfoSection formData={formData} handleChange={handleChange} />

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
