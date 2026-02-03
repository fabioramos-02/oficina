import React, { useState } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { inventoryService } from '../services/inventoryService';
import type { Peca } from '../types';
import { CurrencyInput } from '../../../shared/components/ui/CurrencyInput';

interface QuickCreatePartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPart: Peca) => void;
}

export const QuickCreatePartModal: React.FC<QuickCreatePartModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [codigo, setCodigo] = useState('');
  const [precoVenda, setPrecoVenda] = useState(0);
  const [estoque, setEstoque] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !codigo.trim()) {
      setError('Nome e Código são obrigatórios');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const newPart = await inventoryService.create({
        nome,
        descricao,
        categoria,
        codigo,
        precoVenda,
        precoCusto: 0, // Default to 0 for quick create
        quantidadeEstoque: estoque
      });
      onSuccess(newPart);
      handleClose();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.erro || 'Erro ao criar peça. Verifique se o código já existe.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNome('');
    setDescricao('');
    setCategoria('');
    setCodigo('');
    setPrecoVenda(0);
    setEstoque(1);
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nova Peça Rápida"
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
            placeholder="Ex: Motor, Suspensão..."
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Código *</label>
          <input
            type="text"
            value={codigo}
            onChange={e => setCodigo(e.target.value.toUpperCase())}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Valor Unitário</label>
          <CurrencyInput
            value={precoVenda}
            onChange={setPrecoVenda}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>Estoque Inicial</label>
          <input
            type="number"
            value={estoque}
            onChange={e => setEstoque(parseInt(e.target.value) || 0)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        {error && <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>{error}</p>}
      </form>
    </Modal>
  );
};
