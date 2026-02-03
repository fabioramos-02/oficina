import React from 'react';
import { CurrencyInput } from '../../../../shared/components/ui/CurrencyInput';
import { TipoDesconto } from '../../types';

interface OrderTotalsProps {
  subtotal: number;
  desconto: number;
  setDesconto: (val: number) => void;
  tipoDesconto: TipoDesconto;
  setTipoDesconto: (type: TipoDesconto) => void;
  total: number;
}

export const OrderTotals: React.FC<OrderTotalsProps> = ({
  subtotal, desconto, setDesconto, tipoDesconto, setTipoDesconto, total
}) => {
  return (
    <section style={{ backgroundColor: '#F3F4F6', padding: '16px', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span>Subtotal:</span>
        <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</strong>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Desconto:</span>
          <select 
            value={tipoDesconto} 
            onChange={e => setTipoDesconto(e.target.value as TipoDesconto)}
            style={{ padding: '4px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
          >
            <option value={TipoDesconto.VALOR}>R$</option>
            <option value={TipoDesconto.PORCENTAGEM}>%</option>
          </select>
        </div>
        <div style={{ width: '120px' }}>
          {tipoDesconto === TipoDesconto.VALOR ? (
            <CurrencyInput
              value={desconto}
              onChange={setDesconto}
              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #D1D5DB', width: '100%', textAlign: 'right' }}
            />
          ) : (
            <input 
              type="number" 
              value={desconto} 
              onChange={e => setDesconto(Number(e.target.value))}
              min="0"
              max="100"
              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #D1D5DB', width: '100%', textAlign: 'right' }}
            />
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #D1D5DB', fontSize: '1.25rem', fontWeight: 700 }}>
        <span>Total:</span>
        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
      </div>
    </section>
  );
};
