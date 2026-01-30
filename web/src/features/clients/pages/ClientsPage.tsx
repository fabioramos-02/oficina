import React, { useEffect, useState } from 'react';
import { clientService } from '../services/clientService';
import type { Client, ClientInput } from '../types';
import { ClientList } from '../components/ClientList';
import { ClientForm } from '../components/ClientForm';
import { Modal } from '../../../shared/components/ui/Modal';
import { useToast } from '../../../shared/components/ui/ToastContext';
import { MainLayout } from '../../../shared/layout/MainLayout';

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  
  const { addToast } = useToast();

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      addToast('Erro ao carregar clientes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleAdd = () => {
    setSelectedClient(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (data: ClientInput) => {
    try {
      setIsSaving(true);
      if (selectedClient) {
        await clientService.update(selectedClient.id, data);
        addToast('Cliente atualizado com sucesso!', 'success');
      } else {
        await clientService.create(data);
        addToast('Cliente criado com sucesso!', 'success');
      }
      setIsModalOpen(false);
      loadClients();
    } catch (error) {
      addToast('Erro ao salvar cliente', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedClient) return;
    try {
      await clientService.delete(selectedClient.id);
      addToast('Cliente removido com sucesso!', 'success');
      setIsDeleteModalOpen(false);
      loadClients();
    } catch (error) {
      addToast('Erro ao remover cliente', 'error');
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0 }}>Gerenciar Clientes</h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>Visualize e gerencie seus clientes</p>
        </div>

        <ClientList
          clients={clients}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onAdd={handleAdd}
          isLoading={isLoading}
        />

        {/* Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedClient ? 'Editar Cliente' : 'Novo Cliente'}
        >
          <ClientForm
            initialData={selectedClient}
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
          footer={
            <>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Excluir
              </button>
            </>
          }
        >
          <p style={{ color: '#4B5563' }}>
            Tem certeza que deseja excluir o cliente <strong>{selectedClient?.nome}</strong>?
            Esta ação não pode ser desfeita.
          </p>
        </Modal>
      </div>
    </MainLayout>
  );
};
