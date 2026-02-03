import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { QuickCreateServiceModal } from '../../../services/components/QuickCreateServiceModal';
import { useToast } from '../../../../shared/components/ui/ToastContext';
import type { ItemServicoInput } from '../../types';

interface OrderServicesProps {
  items: ItemServicoInput[];
  onItemsChange: (items: ItemServicoInput[]) => void;
  availableServices: any[];
  setAvailableServices: React.Dispatch<React.SetStateAction<any[]>>;
}

export const OrderServices: React.FC<OrderServicesProps> = ({
  items, onItemsChange, availableServices, setAvailableServices
}) => {
  const { addToast } = useToast();
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [serviceQty, setServiceQty] = useState(1);
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);

  const getServiceName = (id: string) => availableServices.find(s => s.id === id)?.nome || 'Serviço desconhecido';

  const handleAddService = () => {
    if (!selectedServiceId) return;
    const service = availableServices.find(s => s.id === selectedServiceId);
    if (!service) return;

    onItemsChange([...items, {
      servicoId: service.id,
      quantidade: serviceQty,
      precoUnitario: service.preco
    }]);
    setSelectedServiceId('');
    setServiceQty(1);
  };

  const handleRemoveService = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const handleCreateServiceSuccess = (newService: any) => {
    setAvailableServices(prev => [...prev, newService]);
    setSelectedServiceId(newService.id);
    addToast('Serviço criado com sucesso!', 'success');
  };

  return (
    <section>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Serviços</h3>
        <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: '0.875rem' }}>Descrição</th>
                <th style={{ padding: '8px 16px', textAlign: 'center', width: '100px', fontSize: '0.875rem' }}>Qtd</th>
                <th style={{ padding: '8px 16px', textAlign: 'right', width: '120px', fontSize: '0.875rem' }}>Valor Unit.</th>
                <th style={{ padding: '8px 16px', textAlign: 'right', width: '120px', fontSize: '0.875rem' }}>Total</th>
                <th style={{ padding: '8px 16px', width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={{ borderTop: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '8px 16px' }}>{getServiceName(item.servicoId)}</td>
                  <td style={{ padding: '8px 16px', textAlign: 'center' }}>{item.quantidade}</td>
                  <td style={{ padding: '8px 16px', textAlign: 'right' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.precoUnitario)}
                  </td>
                  <td style={{ padding: '8px 16px', textAlign: 'right' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.precoUnitario * item.quantidade)}
                  </td>
                  <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                    <button type="button" onClick={() => handleRemoveService(index)} style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #E5E7EB', backgroundColor: '#F3F4F6' }}>
                <td style={{ padding: '8px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select 
                      value={selectedServiceId} 
                      onChange={e => setSelectedServiceId(e.target.value)}
                      style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                    >
                      <option value="">Adicionar serviço...</option>
                      {availableServices.map(s => <option key={s.id} value={s.id}>{s.nome} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.preco)}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsCreateServiceModalOpen(true)}
                      style={{ border: '1px solid #D1D5DB', background: 'white', borderRadius: '4px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Criar novo serviço"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </td>
                <td style={{ padding: '8px 16px' }}>
                  <input 
                    type="number" 
                    min="1" 
                    value={serviceQty} 
                    onChange={e => setServiceQty(Number(e.target.value))}
                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #D1D5DB', textAlign: 'center' }}
                  />
                </td>
                <td colSpan={2}></td>
                <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                  <button 
                    type="button" 
                    onClick={handleAddService} 
                    disabled={!selectedServiceId}
                    style={{ border: 'none', background: '#3B82F6', color: 'white', borderRadius: '4px', padding: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Plus size={16} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <QuickCreateServiceModal
          isOpen={isCreateServiceModalOpen}
          onClose={() => setIsCreateServiceModalOpen(false)}
          onSuccess={handleCreateServiceSuccess}
        />
    </section>
  );
};
