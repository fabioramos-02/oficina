import React, { useState } from 'react';
import { Edit2, Trash2, Search, Plus, Package } from 'lucide-react';
import type { Peca } from '../types';

interface InventoryListProps {
  pecas: Peca[];
  onEdit: (peca: Peca) => void;
  onDelete: (peca: Peca) => void;
  onAdd: () => void;
  isLoading: boolean;
}

export const InventoryList: React.FC<InventoryListProps> = ({ 
  pecas, 
  onEdit, 
  onDelete, 
  onAdd, 
  isLoading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPecas = pecas.filter(peca => 
    peca.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    peca.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPecas.length / itemsPerPage);
  const paginatedPecas = filteredPecas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <div className="spinner">Carregando...</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {/* Header com Busca e Botão Novo */}
      <div style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Buscar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px 8px 36px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>
        <button
          onClick={onAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#4F46E5',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          <Plus size={18} />
          Nova Peça
        </button>
      </div>

      {/* Tabela */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead style={{ backgroundColor: '#F9FAFB' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Peça / Código</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Preço Custo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Preço Venda</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Estoque</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPecas.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6B7280' }}>
                  Nenhuma peça encontrada
                </td>
              </tr>
            ) : (
              paginatedPecas.map((peca) => (
                <tr key={peca.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
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
                        <Package size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500, color: '#111827' }}>{peca.nome}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{peca.codigo}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#111827' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(peca.precoCusto)}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#111827' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(peca.precoVenda)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      backgroundColor: peca.quantidadeEstoque > 0 ? '#DEF7EC' : '#FDE8E8',
                      color: peca.quantidadeEstoque > 0 ? '#03543F' : '#9B1C1C'
                    }}>
                      {peca.quantidadeEstoque}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => onEdit(peca)}
                        title="Editar"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4F46E5' }}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(peca)}
                        title="Excluir"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            Página {currentPage} de {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ padding: '4px 8px', border: '1px solid #D1D5DB', borderRadius: '4px', background: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ padding: '4px 8px', border: '1px solid #D1D5DB', borderRadius: '4px', background: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
