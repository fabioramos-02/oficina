import React, { useState } from 'react';
import { Plus, Trash2, Car } from 'lucide-react';
import type { ClientInput, Veiculo } from '../../types';

interface VehiclesSectionProps {
  formData: ClientInput;
  onChange: (veiculos: Partial<Veiculo>[]) => void;
  errors?: Partial<Record<string, string>>;
}

export const VehiclesSection: React.FC<VehiclesSectionProps> = ({ formData, onChange, errors }) => {
  const [newVehicle, setNewVehicle] = useState<Partial<Veiculo>>({
    placa: '',
    marca: '',
    modelo: '',
    ano: undefined
  });

  const [addError, setAddError] = useState<string>('');

  const handleAddVehicle = () => {
    if (!newVehicle.placa || !newVehicle.marca || !newVehicle.modelo || !newVehicle.ano) {
      setAddError('Preencha todos os campos do veículo.');
      return;
    }

    const updatedVehicles = [...(formData.veiculos || []), { ...newVehicle, ano: Number(newVehicle.ano) }];
    onChange(updatedVehicles);
    
    // Reset form
    setNewVehicle({
      placa: '',
      marca: '',
      modelo: '',
      ano: undefined
    });
    setAddError('');
  };

  const handleRemoveVehicle = (index: number) => {
    const updatedVehicles = [...(formData.veiculos || [])];
    updatedVehicles.splice(index, 1);
    onChange(updatedVehicles);
  };

  const currentVehicles = formData.veiculos || [];

  return (
    <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Car size={20} />
        Veículos
      </h3>
      
      {/* Lista de Veículos Adicionados */}
      {currentVehicles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {currentVehicles.map((veiculo, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '6px' }}>
              <div>
                <span style={{ fontWeight: '600' }}>{veiculo.placa?.toUpperCase()}</span> - {veiculo.marca} {veiculo.modelo} ({veiculo.ano})
              </div>
              <button 
                type="button" 
                onClick={() => handleRemoveVehicle(index)}
                style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                title="Remover veículo"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Formulário para Adicionar Novo Veículo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Placa *</label>
          <input
            type="text"
            value={newVehicle.placa || ''}
            onChange={e => setNewVehicle(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))}
            placeholder="ABC-1234"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Marca *</label>
          <input
            type="text"
            value={newVehicle.marca || ''}
            onChange={e => setNewVehicle(prev => ({ ...prev, marca: e.target.value }))}
            placeholder="Ex: Fiat"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Modelo *</label>
          <input
            type="text"
            value={newVehicle.modelo || ''}
            onChange={e => setNewVehicle(prev => ({ ...prev, modelo: e.target.value }))}
            placeholder="Ex: Uno"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Ano *</label>
          <input
            type="number"
            value={newVehicle.ano || ''}
            onChange={e => setNewVehicle(prev => ({ ...prev, ano: parseInt(e.target.value) || undefined }))}
            placeholder="2020"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        <button
          type="button"
          onClick={handleAddVehicle}
          style={{
            padding: '8px',
            backgroundColor: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            height: '38px', // Match input height roughly
            width: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Adicionar veículo"
        >
          <Plus size={20} />
        </button>
      </div>
      {addError && <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '8px' }}>{addError}</p>}
    </div>
  );
};
