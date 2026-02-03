import React from 'react';

interface OrderBasicInfoProps {
  clienteId: string;
  setClienteId: (id: string) => void;
  veiculoId: string;
  setVeiculoId: (id: string) => void;
  observacoes: string;
  setObservacoes: (obs: string) => void;
  clientes: any[];
  veiculos: any[];
}

export const OrderBasicInfo: React.FC<OrderBasicInfoProps> = ({
  clienteId, setClienteId,
  veiculoId, setVeiculoId,
  observacoes, setObservacoes,
  clientes, veiculos
}) => {
  return (
    <section>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Informações Básicas</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Cliente</label>
          <select 
            value={clienteId} 
            onChange={e => {
              setClienteId(e.target.value);
              setVeiculoId(''); 
            }}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
            required
          >
            <option value="">Selecione um cliente</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Veículo</label>
          <select 
            value={veiculoId} 
            onChange={e => setVeiculoId(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
            disabled={!clienteId}
          >
            <option value="">{clienteId ? (veiculos.length ? "Selecione um veículo" : "Cliente sem veículos") : "Selecione um cliente primeiro"}</option>
            {veiculos.map(v => <option key={v.id} value={v.id}>{v.modelo} - {v.placa}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Observações Gerais</label>
          <textarea 
            value={observacoes} 
            onChange={e => setObservacoes(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', minHeight: '60px' }}
          />
        </div>
      </div>
    </section>
  );
};
