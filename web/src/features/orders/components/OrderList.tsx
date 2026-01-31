import React, { useState } from 'react';
import { Edit2, Trash2, Search, Plus, FileText, Filter } from 'lucide-react';
import type { Order } from '../types';

interface OrderListProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  onAdd: () => void;
  isLoading: boolean;
  onFilterStatus: (status: string) => void;
  onSearch: (term: string) => void;
}

const statusColors: Record<string, string> = {
  EM_ANDAMENTO: '#3B82F6', // Blue
  CONCLUIDO: '#10B981',    // Green
  CANCELADO: '#EF4444'     // Red
};

const statusLabels: Record<string, string> = {
  EM_ANDAMENTO: 'Em Andamento',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado'
};

export const OrderList: React.FC<OrderListProps> = ({ orders, onEdit, onDelete, onAdd, isLoading, onFilterStatus, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Handlers for local state to debounce or pass up
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStatusFilter(val);
    onFilterStatus(val);
  };

  // Helper functions
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');
  const formatOrderNumber = (num: number, year: number) => `${num.toString().padStart(3, '0')}-${year}`;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <div className="spinner" style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3', 
          borderTop: '4px solid #3498db', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {/* Header Actions */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Buscar por cliente ou número..."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ position: 'relative', minWidth: '150px' }}>
            <Filter size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '6px',
                border: '1px solid #D1D5DB',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="">Todos os status</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        </div>

        <button
          onClick={onAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          <Plus size={20} />
          Novo Pedido
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead style={{ backgroundColor: '#F9FAFB' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Pedido / Data</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Cliente / Veículo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Valor Total</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6B7280' }}>
                  Nenhum pedido encontrado
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: '#111827' }}>{formatOrderNumber(order.numero, order.ano)}</span>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        {formatDate(order.dataCriacao)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        backgroundColor: '#E0E7FF', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#4F46E5'
                      }}>
                        <FileText size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: '#111827' }}>{order.cliente?.nome || 'Cliente Removido'}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          {order.veiculo ? `${order.veiculo.modelo} - ${order.veiculo.placa}` : 'Sem veículo'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      backgroundColor: `${statusColors[order.status]}20`, // 20% opacity
                      color: statusColors[order.status]
                    }}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                    {formatCurrency(order.valorTotal)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => onEdit(order)}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #D1D5DB', backgroundColor: 'white', cursor: 'pointer', color: '#4B5563' }}
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(order)}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #FECACA', backgroundColor: '#FEF2F2', cursor: 'pointer', color: '#EF4444' }}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
