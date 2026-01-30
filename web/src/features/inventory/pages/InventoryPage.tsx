import React, { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventoryService';
import type { Peca, PecaInput } from '../types';
import { InventoryList } from '../components/InventoryList';
import { InventoryForm } from '../components/InventoryForm';
import { Modal } from '../../../shared/components/ui/Modal';
import { useToast } from '../../../shared/components/ui/ToastContext';
import { MainLayout } from '../../../shared/layout/MainLayout';

export const InventoryPage: React.FC = () => {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPeca, setSelectedPeca] = useState<Peca | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  
  const { addToast } = useToast();

  const loadPecas = async () => {
    try {
      setIsLoading(true);
      const data = await inventoryService.getAll();
      setPecas(data);
    } catch (error) {
      addToast('Erro ao carregar estoque', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPecas();
  }, []);

  const handleAdd = () => {
    setSelectedPeca(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (peca: Peca) => {
    setSelectedPeca(peca);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (peca: Peca) => {
    setSelectedPeca(peca);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: PecaInput) => {
    try {
      setIsSaving(true);
      if (selectedPeca) {
        await inventoryService.update(selectedPeca.id, data);
        addToast('Peça atualizada com sucesso', 'success');
      } else {
        await inventoryService.create(data);
        addToast('Peça criada com sucesso', 'success');
      }
      setIsModalOpen(false);
      loadPecas();
    } catch (error: any) {
      const msg = error.response?.data?.erro || 'Erro ao salvar peça';
      addToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedPeca) return;
    try {
      await inventoryService.delete(selectedPeca.id);
      addToast('Peça removida com sucesso', 'success');
      setIsDeleteModalOpen(false);
      loadPecas();
    } catch (error) {
      addToast('Erro ao remover peça', 'error');
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0 }}>
            Peças & Estoque
          </h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>
            Gerencie o inventário de peças e produtos da oficina
          </p>
        </div>

        <InventoryList
          pecas={pecas}
          isLoading={isLoading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {/* Modal de Formulário */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedPeca ? 'Editar Peça' : 'Nova Peça'}
        >
          <InventoryForm
            initialData={selectedPeca}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            isLoading={isSaving}
          />
        </Modal>

        {/* Modal de Confirmação de Exclusão */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirmar Exclusão"
        >
          <div style={{ padding: '8px 0' }}>
            <p style={{ color: '#4B5563', marginBottom: '24px' }}>
              Tem certeza que deseja excluir a peça <strong>{selectedPeca?.nome}</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
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
