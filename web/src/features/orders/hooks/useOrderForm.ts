import { useState, useEffect } from 'react';
import { clientService } from '../../clients/services/clientService';
import { serviceService } from '../../services/services/serviceService';
import { inventoryService } from '../../inventory/services/inventoryService';
import type { Order, OrderInput, ItemServicoInput, ItemPecaInput } from '../types';
import { TipoDesconto } from '../types';

interface UseOrderFormProps {
  initialData?: Order;
  onSubmit: (data: OrderInput) => Promise<void>;
}

export const useOrderForm = ({ initialData, onSubmit }: UseOrderFormProps) => {
  // Form State
  const [clienteId, setClienteId] = useState(initialData?.clienteId || '');
  const [veiculoId, setVeiculoId] = useState(initialData?.veiculoId || '');
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || '');
  
  // Vehicle Details
  const [veiculoKm, setVeiculoKm] = useState<string | number>(initialData?.veiculoKm || '');
  const [veiculoCombustivel, setVeiculoCombustivel] = useState(initialData?.veiculoCombustivel || '');
  const [defeitoRelatado, setDefeitoRelatado] = useState(initialData?.defeitoRelatado || '');
  const [veiculoObservacoes, setVeiculoObservacoes] = useState(initialData?.veiculoObservacoes || '');

  // Items
  const [itemsServicos, setItemsServicos] = useState<ItemServicoInput[]>(
    initialData?.servicos?.map(s => ({ servicoId: s.servico.id, quantidade: s.quantidade, precoUnitario: s.precoUnitario })) || []
  );
  const [itemsPecas, setItemsPecas] = useState<ItemPecaInput[]>(
    initialData?.pecas?.map(p => ({ pecaId: p.peca.id, quantidade: p.quantidadeUtilizada, precoUnitario: p.precoUnitarioUtilizado })) || []
  );

  // Discount
  const [desconto, setDesconto] = useState(initialData?.desconto || 0);
  const [tipoDesconto, setTipoDesconto] = useState<TipoDesconto>(initialData?.tipoDesconto || TipoDesconto.VALOR);

  // Data Sources
  const [clientes, setClientes] = useState<any[]>([]);
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [availableParts, setAvailableParts] = useState<any[]>([]);

  // Load Data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, servicesData, partsData] = await Promise.all([
          clientService.getAll(),
          serviceService.getAll(),
          inventoryService.getAll()
        ]);
        setClientes(clientsData);
        setAvailableServices(servicesData);
        setAvailableParts(partsData);
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    };
    loadData();
  }, []);

  // Load Vehicles when Client changes
  useEffect(() => {
    if (clienteId) {
      const client = clientes.find(c => c.id === clienteId);
      setVeiculos(client?.veiculos || []);
    } else {
      setVeiculos([]);
    }
  }, [clienteId, clientes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clienteId,
      veiculoId: veiculoId || undefined,
      observacoes,
      veiculoKm: veiculoKm ? Number(veiculoKm) : 0,
      veiculoCombustivel,
      defeitoRelatado,
      veiculoObservacoes,
      itemsServicos,
      itemsPecas,
      desconto,
      tipoDesconto,
      status: initialData?.status
    });
  };

  // Calculations
  const totalServicos = itemsServicos.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0);
  const totalPecas = itemsPecas.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0);
  const subtotal = totalServicos + totalPecas;
  const valorDesconto = tipoDesconto === TipoDesconto.PORCENTAGEM ? (subtotal * desconto / 100) : desconto;
  const total = Math.max(0, subtotal - valorDesconto);

  return {
    formState: {
      clienteId, setClienteId,
      veiculoId, setVeiculoId,
      observacoes, setObservacoes,
      veiculoKm, setVeiculoKm,
      veiculoCombustivel, setVeiculoCombustivel,
      defeitoRelatado, setDefeitoRelatado,
      veiculoObservacoes, setVeiculoObservacoes,
      itemsServicos, setItemsServicos,
      itemsPecas, setItemsPecas,
      desconto, setDesconto,
      tipoDesconto, setTipoDesconto,
    },
    data: {
      clientes,
      veiculos,
      availableServices, setAvailableServices,
      availableParts, setAvailableParts,
    },
    calculations: {
      subtotal,
      valorDesconto,
      total,
    },
    handleSubmit,
  };
};
