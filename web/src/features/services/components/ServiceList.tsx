import React, { useState } from 'react';
import { Edit2, Trash2, Search, Plus } from 'lucide-react';
import type { Servico } from '../types';

interface ServiceListProps {
  servicos: Servico[];
  onEdit: (servico: Servico) => void;
  onDelete: (servico: Servico) => void;
  onAdd: () => void;
  isLoading: boolean;
}

export const ServiceList: React.FC<ServiceListProps> = ({ 
  servicos, 
  onEdit, 
  onDelete, 
  onAdd, 
  isLoading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredServicos = servicos.filter(servico => 
    servico.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServicos.length / itemsPerPage);
  const paginatedServicos = filteredServicos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

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
            placeholder="Buscar por nome..."
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
          Novo Serviço
        </button>
      </div>

      {/* Tabela */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead style={{ backgroundColor: '#F9FAFB' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Nome do Serviço</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Preço</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServicos.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#6B7280' }}>
                  Nenhum serviço encontrado.
                </td>
              </tr>
            ) : (
              paginatedServicos.map((servico) => (
                <tr key={servico.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '12px 16px', color: '#111827', fontWeight: 500 }}>
                    {servico.nome}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#111827' }}>
                    {formatCurrency(servico.preco)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => onEdit(servico)}
                        title="Editar"
                        style={{
                          padding: '6px',
                          color: '#4F46E5',
                          backgroundColor: '#EEF2FF',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(servico)}
                        title="Excluir"
                        style={{
                          padding: '6px',
                          color: '#EF4444',
                          backgroundColor: '#FEF2F2',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
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

      {/* Paginação */}
      {totalPages > 1 && (
        <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredServicos.length)} de {filteredServicos.length} resultados
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '6px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: currentPage === 1 ? '#9CA3AF' : '#374151',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: currentPage === totalPages ? '#9CA3AF' : '#374151',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
