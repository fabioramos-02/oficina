import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { QuickCreatePartModal } from '../../../inventory/components/QuickCreatePartModal';
import { useToast } from '../../../../shared/components/ui/ToastContext';
import type { ItemPecaInput } from '../../types';

interface OrderPartsProps {
  items: ItemPecaInput[];
  onItemsChange: (items: ItemPecaInput[]) => void;
  availableParts: any[];
  setAvailableParts: React.Dispatch<React.SetStateAction<any[]>>;
}

export const OrderParts: React.FC<OrderPartsProps> = ({
  items, onItemsChange, availableParts, setAvailableParts
}) => {
  const { addToast } = useToast();
  const [selectedPartId, setSelectedPartId] = useState('');
  const [partQty, setPartQty] = useState(1);
  const [isCreatePartModalOpen, setIsCreatePartModalOpen] = useState(false);

  const getPartName = (id: string) => availableParts.find(p => p.id === id)?.nome || 'Peça desconhecida';

  const handleAddPart = () => {
    if (!selectedPartId) return;
    const part = availableParts.find(p => p.id === selectedPartId);
    if (!part) return;

    onItemsChange([...items, {
      pecaId: part.id,
      quantidade: partQty,
      precoUnitario: part.precoVenda
    }]);
    setSelectedPartId('');
    setPartQty(1);
  };

  const handleRemovePart = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const handleCreatePartSuccess = (newPart: any) => {
    setAvailableParts(prev => [...prev, newPart]);
    setSelectedPartId(newPart.id);
    addToast('Peça criada com sucesso!', 'success');
  };

  return (
    <section>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Peças</h3>
        <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: '0.875rem' }}>Peça</th>
                <th style={{ padding: '8px 16px', textAlign: 'center', width: '100px', fontSize: '0.875rem' }}>Qtd</th>
                <th style={{ padding: '8px 16px', textAlign: 'right', width: '120px', fontSize: '0.875rem' }}>Valor Unit.</th>
                <th style={{ padding: '8px 16px', textAlign: 'right', width: '120px', fontSize: '0.875rem' }}>Total</th>
                <th style={{ padding: '8px 16px', width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={{ borderTop: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '8px 16px' }}>{getPartName(item.pecaId)}</td>
                  <td style={{ padding: '8px 16px', textAlign: 'center' }}>{item.quantidade}</td>
                  <td style={{ padding: '8px 16px', textAlign: 'right' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.precoUnitario)}
                  </td>
                  <td style={{ padding: '8px 16px', textAlign: 'right' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.precoUnitario * item.quantidade)}
                  </td>
                  <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                    <button type="button" onClick={() => handleRemovePart(index)} style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #E5E7EB', backgroundColor: '#F3F4F6' }}>
                <td style={{ padding: '8px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select 
                      value={selectedPartId} 
                      onChange={e => setSelectedPartId(e.target.value)}
                      style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                    >
                      <option value="">Adicionar peça...</option>
                      {availableParts.map(p => <option key={p.id} value={p.id}>{p.nome} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.precoVenda)}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsCreatePartModalOpen(true)}
                      style={{ border: '1px solid #D1D5DB', background: 'white', borderRadius: '4px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Criar nova peça"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </td>
                <td style={{ padding: '8px 16px' }}>
                  <input 
                    type="number" 
                    min="1" 
                    value={partQty} 
                    onChange={e => setPartQty(Number(e.target.value))}
                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #D1D5DB', textAlign: 'center' }}
                  />
                </td>
                <td colSpan={2}></td>
                <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                  <button 
                    type="button" 
                    onClick={handleAddPart} 
                    disabled={!selectedPartId}
                    style={{ border: 'none', background: '#3B82F6', color: 'white', borderRadius: '4px', padding: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Plus size={16} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <QuickCreatePartModal
          isOpen={isCreatePartModalOpen}
          onClose={() => setIsCreatePartModalOpen(false)}
          onSuccess={handleCreatePartSuccess}
        />
    </section>
  );
};
