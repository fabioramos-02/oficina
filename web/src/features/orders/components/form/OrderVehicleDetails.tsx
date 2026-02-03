import React from 'react';

interface OrderVehicleDetailsProps {
  veiculoKm: string | number;
  setVeiculoKm: (km: string | number) => void;
  veiculoCombustivel: string;
  setVeiculoCombustivel: (fuel: string) => void;
  defeitoRelatado: string;
  setDefeitoRelatado: (defect: string) => void;
  veiculoObservacoes: string;
  setVeiculoObservacoes: (obs: string) => void;
}

export const OrderVehicleDetails: React.FC<OrderVehicleDetailsProps> = ({
  veiculoKm, setVeiculoKm,
  veiculoCombustivel, setVeiculoCombustivel,
  defeitoRelatado, setDefeitoRelatado,
  veiculoObservacoes, setVeiculoObservacoes
}) => {
  return (
    <section>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Detalhes do Veículo</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Quilometragem</label>
          <input 
            type="number" 
            value={veiculoKm} 
            onChange={e => setVeiculoKm(e.target.value)}
            placeholder="0"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Combustível</label>
          <input 
            type="text" 
            value={veiculoCombustivel} 
            onChange={e => setVeiculoCombustivel(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Defeito Relatado</label>
          <input 
            type="text" 
            value={defeitoRelatado} 
            onChange={e => setDefeitoRelatado(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Observações do Veículo</label>
          <textarea 
            value={veiculoObservacoes} 
            onChange={e => setVeiculoObservacoes(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', minHeight: '60px' }}
          />
        </div>
      </div>
    </section>
  );
};
