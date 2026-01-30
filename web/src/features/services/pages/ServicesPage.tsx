import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../../shared/layout/MainLayout';
import { Modal } from '../../../shared/components/ui/Modal';
import { useToast } from '../../../shared/components/ui/ToastContext';
import { ServiceList } from '../components/ServiceList';
import { ServiceForm } from '../components/ServiceForm';
import { serviceService } from '../services/serviceService';
import type { Servico, ServicoInput } from '../types';

export const ServicesPage: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedServico, setSelectedServico] = useState<Servico | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  
  const { addToast } = useToast();

  const loadServicos = async () => {
    try {
      setIsLoading(true);
      const data = await serviceService.getAll();
      setServicos(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      addToast('Erro ao carregar serviços.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServicos();
  }, []);

  const handleAdd = () => {
    setSelectedServico(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (servico: Servico) => {
    setSelectedServico(servico);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (servico: Servico) => {
    setSelectedServico(servico);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: ServicoInput) => {
    try {
      setIsSaving(true);
      if (selectedServico) {
        await serviceService.update(selectedServico.id, data);
        addToast('Serviço atualizado com sucesso!', 'success');
      } else {
        await serviceService.create(data);
        addToast('Serviço criado com sucesso!', 'success');
      }
      setIsModalOpen(false);
      loadServicos();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      addToast('Erro ao salvar serviço.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedServico) return;
    
    try {
      await serviceService.delete(selectedServico.id);
      addToast('Serviço excluído com sucesso!', 'success');
      setIsDeleteModalOpen(false);
      loadServicos();
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      addToast('Erro ao excluir serviço.', 'error');
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0 }}>
            Serviços
          </h1>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>
            Gerencie o catálogo de serviços oferecidos pela oficina
          </p>
        </div>

        <ServiceList
          servicos={servicos}
          isLoading={isLoading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {/* Modal de Formulário */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedServico ? 'Editar Serviço' : 'Novo Serviço'}
        >
          <ServiceForm
            initialData={selectedServico}
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
              Tem certeza que deseja excluir o serviço <strong>{selectedServico?.nome}</strong>? 
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
