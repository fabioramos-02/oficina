import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import type { Order, OrderInput } from '../types';
import { OrderList } from '../components/OrderList';
import { OrderForm } from '../components/OrderForm';
import { Modal } from '../../../shared/components/ui/Modal';
import { useToast } from '../../../shared/components/ui/ToastContext';
import { MainLayout } from '../../../shared/layout/MainLayout';
import { StatusOrdemServico } from '../types';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const { addToast } = useToast();

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const filters: { status?: StatusOrdemServico; busca?: string } = {};
      if (statusFilter) filters.status = statusFilter as StatusOrdemServico;
      if (searchTerm) filters.busca = searchTerm;

      const data = await orderService.getAll(filters);
      setOrders(data);
    } catch (error) {
      addToast('Erro ao carregar pedidos', 'error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadOrders();
    }, 500); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [statusFilter, searchTerm]);

  const handleAdd = () => {
    setSelectedOrder(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (order: Order) => {
    // Check if order is editable (EM_ANDAMENTO)
    if (order.status !== StatusOrdemServico.EM_ANDAMENTO) {
      addToast('Apenas pedidos em andamento podem ser editados.', 'warning');
      // Allow viewing but maybe disable fields? For now, we block editing via UI or let backend reject.
      // The requirement says "Status define se o pedido pode ou não ser editado".
      // Let's allow opening the modal, but maybe we should handle read-only mode or just block save.
      // For now, I'll block opening the edit modal for non-EM_ANDAMENTO, or maybe better, open in read-only?
      // Given the complexity, let's allow opening, but the backend will reject updates.
      // Better UX: warn user.
    }
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (data: OrderInput) => {
    try {
      setIsSaving(true);
      if (selectedOrder) {
        await orderService.update(selectedOrder.id, data);
        addToast('Pedido atualizado com sucesso!', 'success');
      } else {
        await orderService.create(data);
        addToast('Pedido criado com sucesso!', 'success');
      }
      setIsModalOpen(false);
      loadOrders();
    } catch (error: any) {
      console.error(error);
      addToast(error.response?.data?.message || 'Erro ao salvar pedido', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrder) return;
    try {
      await orderService.delete(selectedOrder.id);
      addToast('Pedido removido com sucesso!', 'success');
      setIsDeleteModalOpen(false);
      loadOrders();
    } catch (error) {
      addToast('Erro ao remover pedido', 'error');
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0 }}>Gerenciar Pedidos</h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>Visualize e gerencie as ordens de serviço</p>
        </div>

        <OrderList
          orders={orders}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onAdd={handleAdd}
          isLoading={isLoading}
          onFilterStatus={setStatusFilter}
          onSearch={setSearchTerm}
        />

        {/* Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedOrder ? `Editar Pedido #${selectedOrder.numero}-${selectedOrder.ano}` : 'Novo Pedido'}
          maxWidth="800px"
        >
          <OrderForm
            initialData={selectedOrder}
            onSubmit={handleSave}
            onCancel={() => setIsModalOpen(false)}
            isLoading={isSaving}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirmar Exclusão"
          maxWidth="400px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p>Tem certeza que deseja remover o pedido <strong>#{selectedOrder?.numero}-{selectedOrder?.ano}</strong>?</p>
            <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>Esta ação não pode ser desfeita.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#EF4444', color: 'white', cursor: 'pointer' }}
              >
                Excluir
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
};
