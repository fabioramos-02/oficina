import React from 'react';
import { Printer } from 'lucide-react';
import type { Order, OrderInput } from '../types';
import { StatusOrdemServico } from '../types';
import { useOrderForm } from '../hooks/useOrderForm';
import { OrderBasicInfo } from './form/OrderBasicInfo';
import { OrderVehicleDetails } from './form/OrderVehicleDetails';
import { OrderServices } from './form/OrderServices';
import { OrderParts } from './form/OrderParts';
import { OrderTotals } from './form/OrderTotals';
import { useToast } from '../../../shared/components/ui/ToastContext';

interface OrderFormProps {
  initialData?: Order;
  onSubmit: (data: OrderInput) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { formState, data, calculations, handleSubmit } = useOrderForm({ initialData, onSubmit });
  const { addToast } = useToast();

  const handleEmitirNota = () => {
    // Aqui viria a lógica real de integração com sistema de notas
    addToast('Nota Fiscal emitida com sucesso! (Simulação)', 'success');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <OrderBasicInfo 
        clienteId={formState.clienteId}
        setClienteId={formState.setClienteId}
        veiculoId={formState.veiculoId}
        setVeiculoId={formState.setVeiculoId}
        observacoes={formState.observacoes}
        setObservacoes={formState.setObservacoes}
        clientes={data.clientes}
        veiculos={data.veiculos}
      />

      <OrderVehicleDetails 
        veiculoKm={formState.veiculoKm}
        setVeiculoKm={formState.setVeiculoKm}
        veiculoCombustivel={formState.veiculoCombustivel}
        setVeiculoCombustivel={formState.setVeiculoCombustivel}
        defeitoRelatado={formState.defeitoRelatado}
        setDefeitoRelatado={formState.setDefeitoRelatado}
        veiculoObservacoes={formState.veiculoObservacoes}
        setVeiculoObservacoes={formState.setVeiculoObservacoes}
      />

      <OrderServices 
        items={formState.itemsServicos}
        onItemsChange={formState.setItemsServicos}
        availableServices={data.availableServices}
        setAvailableServices={data.setAvailableServices}
      />

      <OrderParts 
        items={formState.itemsPecas}
        onItemsChange={formState.setItemsPecas}
        availableParts={data.availableParts}
        setAvailableParts={data.setAvailableParts}
      />

      <OrderTotals 
        subtotal={calculations.subtotal}
        desconto={formState.desconto}
        setDesconto={formState.setDesconto}
        tipoDesconto={formState.tipoDesconto}
        setTipoDesconto={formState.setTipoDesconto}
        total={calculations.total}
      />

      {initialData && (
        <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <label style={{ fontWeight: 500, color: '#374151' }}>Status do Pedido:</label>
            <select
              value={formState.status}
              onChange={(e) => formState.setStatus(e.target.value as StatusOrdemServico)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', minWidth: '150px' }}
            >
              <option value={StatusOrdemServico.EM_ANDAMENTO}>Em Andamento</option>
              <option value={StatusOrdemServico.CONCLUIDO}>Concluído</option>
              <option value={StatusOrdemServico.CANCELADO}>Cancelado</option>
            </select>
          </div>
          
          <button
            type="button"
            onClick={handleEmitirNota}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '8px 16px', 
              backgroundColor: '#10B981', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <Printer size={18} />
            Emitir Nota
          </button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{ padding: '10px 20px', backgroundColor: 'white', color: '#374151', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={{ padding: '10px 20px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, opacity: isLoading ? 0.7 : 1 }}
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Ordem de Serviço'}
        </button>
      </div>
    </form>
  );
};
