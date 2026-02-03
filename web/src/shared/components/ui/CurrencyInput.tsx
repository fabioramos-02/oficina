import React, { useRef, useState } from 'react';

interface CurrencyInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  style?: React.CSSProperties;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '0,00',
  error,
  required,
  style
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Formata o número para string BRL (ex: 10.5 -> "10,50")
  const formatCurrency = (val: number) => {
    if (val === undefined || val === null) return '';
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Lida com a entrada de texto do usuário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Remove tudo que não for dígito
    const digits = inputValue.replace(/\D/g, '');
    
    // Converte para número (divide por 100 para considerar os centavos)
    // Se estiver vazio, assume 0
    const numberValue = parseInt(digits || '0', 10) / 100;
    
    onChange(numberValue);
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        marginBottom: '6px',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: error ? '#EF4444' : '#374151'
      }}>
        {label} {required && '*'}
      </label>
      
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '8px 12px',
          borderRadius: '6px',
          border: `1px solid ${error ? '#EF4444' : (isFocused ? '#4F46E5' : '#D1D5DB')}`,
          backgroundColor: 'white',
          cursor: 'text',
          transition: 'all 0.2s ease',
          boxShadow: isFocused ? '0 0 0 3px rgba(79, 70, 229, 0.1)' : 'none',
          ...style
        }}
      >
        <span style={{
          color: '#6B7280',
          marginRight: '4px',
          fontWeight: 500,
          userSelect: 'none'
        }}>
          R$
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={formatCurrency(value)}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            fontSize: '0.875rem',
            color: '#111827',
            backgroundColor: 'transparent',
            padding: 0,
            margin: 0
          }}
        />
      </div>
      {error && (
        <span style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};
