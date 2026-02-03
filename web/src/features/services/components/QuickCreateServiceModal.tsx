import React, { useState } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { serviceService } from '../services/serviceService';
import type { Servico } from '../types';
import { CurrencyInput } from '../../../shared/components/ui/CurrencyInput';

interface QuickCreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newService: Servico) => void;
}

export const QuickCreateServiceModal: React.FC<QuickCreateServiceModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const newService = await serviceService.create({ 
        nome, 
        descricao,
        categoria,
        preco 
      });
      onSuccess(newService);
      handleClose();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.erro || 'Erro ao criar serviço';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNome('');
    setDescricao('');
    setCategoria('');
    setPreco(0);
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Novo Serviço Rápido"
      maxWidth="400px"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', cursor: 'pointer' }}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563EB', color: 'white', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Nome *</label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
            autoFocus
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Descrição</label>
          <textarea
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', minHeight: '60px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Categoria</label>
          <input
            type="text"
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
            placeholder="Ex: Manutenção, Elétrica..."
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Valor Unitário</label>
          <CurrencyInput
            value={preco}
            onChange={setPreco}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        {error && <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>{error}</p>}
      </form>
    </Modal>
  );
};
