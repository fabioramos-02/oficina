import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { clientService } from '../../clients/services/clientService';
import { serviceService } from '../../services/services/serviceService';
import { inventoryService } from '../../inventory/services/inventoryService';
import type { Order, OrderInput, ItemServicoInput, ItemPecaInput } from '../types';
import { StatusOrdemServico, TipoDesconto } from '../types';

interface OrderFormProps {
  initialData?: Order;
  onSubmit: (data: OrderInput) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  // Form State
  const [clienteId, setClienteId] = useState(initialData?.clienteId || '');
  const [veiculoId, setVeiculoId] = useState(initialData?.veiculoId || '');
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || '');
  
  // Vehicle Details
  const [veiculoKm, setVeiculoKm] = useState(initialData?.veiculoKm || 0);
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

  // Temporary state for adding new items
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [serviceQty, setServiceQty] = useState(1);
  const [selectedPartId, setSelectedPartId] = useState('');
  const [partQty, setPartQty] = useState(1);

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

  const handleAddService = () => {
    if (!selectedServiceId) return;
    const service = availableServices.find(s => s.id === selectedServiceId);
    if (!service) return;

    setItemsServicos([...itemsServicos, {
      servicoId: service.id,
      quantidade: serviceQty,
      precoUnitario: service.preco // Assuming service has preco
    }]);
    setSelectedServiceId('');
    setServiceQty(1);
  };

  const handleRemoveService = (index: number) => {
    setItemsServicos(itemsServicos.filter((_, i) => i !== index));
  };

  const handleAddPart = () => {
    if (!selectedPartId) return;
    const part = availableParts.find(p => p.id === selectedPartId);
    if (!part) return;

    setItemsPecas([...itemsPecas, {
      pecaId: part.id,
      quantidade: partQty,
      precoUnitario: part.precoVenda // Assuming part has precoVenda
    }]);
    setSelectedPartId('');
    setPartQty(1);
  };

  const handleRemovePart = (index: number) => {
    setItemsPecas(itemsPecas.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clienteId,
      veiculoId: veiculoId || undefined, // Send undefined if empty
      observacoes,
      veiculoKm,
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

  // Calculations for display
  const totalServicos = itemsServicos.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0);
  const totalPecas = itemsPecas.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0);
  const subtotal = totalServicos + totalPecas;
  const valorDesconto = tipoDesconto === TipoDesconto.PORCENTAGEM ? (subtotal * desconto / 100) : desconto;
  const total = Math.max(0, subtotal - valorDesconto);

  // Helpers to get names
  const getServiceName = (id: string) => availableServices.find(s => s.id === id)?.nome || 'Serviço desconhecido';
  const getPartName = (id: string) => availableParts.find(p => p.id === id)?.nome || 'Peça desconhecida';

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Basic Info */}
      <section>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Informações Básicas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Cliente</label>
            <select 
              value={clienteId} 
              onChange={e => {
                setClienteId(e.target.value);
                setVeiculoId(''); // Reset vehicle when client changes
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

      {/* 2. Vehicle Details */}
      <section>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Detalhes do Veículo</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Quilometragem</label>
            <input 
              type="number" 
              value={veiculoKm} 
              onChange={e => setVeiculoKm(Number(e.target.value))}
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
        </div>
      </section>

      {/* 3. Services */}
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
              {itemsServicos.map((item, index) => (
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
                  <select 
                    value={selectedServiceId} 
                    onChange={e => setSelectedServiceId(e.target.value)}
                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                  >
                    <option value="">Adicionar serviço...</option>
                    {availableServices.map(s => <option key={s.id} value={s.id}>{s.nome} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.preco)}</option>)}
                  </select>
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
      </section>

      {/* 4. Parts */}
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
              {itemsPecas.map((item, index) => (
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
                  <select 
                    value={selectedPartId} 
                    onChange={e => setSelectedPartId(e.target.value)}
                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                  >
                    <option value="">Adicionar peça...</option>
                    {availableParts.map(p => <option key={p.id} value={p.id}>{p.nome} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.precoVenda)}</option>)}
                  </select>
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
      </section>

      {/* 5. Totals */}
      <section style={{ backgroundColor: '#F3F4F6', padding: '16px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>Subtotal:</span>
          <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
          <span>Desconto:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select 
              value={tipoDesconto} 
              onChange={e => setTipoDesconto(e.target.value as TipoDesconto)}
              style={{ padding: '4px', borderRadius: '4px' }}
            >
              <option value={TipoDesconto.VALOR}>R$</option>
              <option value={TipoDesconto.PORCENTAGEM}>%</option>
            </select>
            <input 
              type="number" 
              value={desconto} 
              onChange={e => setDesconto(Number(e.target.value))}
              style={{ width: '80px', padding: '4px', borderRadius: '4px' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '8px', borderTop: '1px solid #D1D5DB', paddingTop: '8px' }}>
          <span>Total:</span>
          <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
        </div>
      </section>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', cursor: 'pointer' }}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563EB', color: 'white', cursor: 'pointer' }}
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Pedido'}
        </button>
      </div>
    </form>
  );
};
