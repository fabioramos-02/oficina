import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientList } from './ClientList';
import type { Client } from '../types';

describe('ClientList', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnAdd = vi.fn();

  const mockClients: Client[] = Array.from({ length: 15 }, (_, i) => ({
    id: `${i + 1}`,
    nome: `Client ${i + 1}`,
    email: `client${i + 1}@example.com`,
    telefone: `12345678${i}`,
    endereco: `Address ${i + 1}`
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    render(
      <ClientList 
        clients={[]} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        onAdd={mockOnAdd} 
        isLoading={true} 
      />
    );

    // Assuming the spinner has class "spinner" or similar, or we check for absence of table
    // The current implementation renders a div with class "spinner" inside
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should render client list correctly', () => {
    render(
      <ClientList 
        clients={mockClients} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        onAdd={mockOnAdd} 
        isLoading={false} 
      />
    );

    expect(screen.getByText('Client 1')).toBeInTheDocument();
    expect(screen.getByText('Client 10')).toBeInTheDocument();
    // Should verify pagination (only 10 items)
    expect(screen.queryByText('Client 11')).not.toBeInTheDocument();
  });

  it('should filter clients by search term', async () => {
    render(
      <ClientList 
        clients={mockClients} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        onAdd={mockOnAdd} 
        isLoading={false} 
      />
    );

    const searchInput = screen.getByPlaceholderText('Buscar clientes...');
    await userEvent.type(searchInput, 'Client 11');

    expect(screen.getByText('Client 11')).toBeInTheDocument();
    expect(screen.queryByText('Client 1')).not.toBeInTheDocument(); // Client 1 matches "Client 11" partially? No, "Client 1" is substring of "Client 11" but "Client 11" is not substring of "Client 1". Wait. "Client 1" IS substring of "Client 11".
    // "Client 11" contains "Client 11". "Client 1" contains "Client 1".
    // If I search "Client 11", "Client 1" should NOT show unless it matches.
    // "Client 1" does NOT contain "Client 11". Correct.
  });

  it('should handle pagination', () => {
    render(
      <ClientList 
        clients={mockClients} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        onAdd={mockOnAdd} 
        isLoading={false} 
      />
    );

    // First page should show 1-10
    expect(screen.getByText('Client 1')).toBeInTheDocument();
    expect(screen.queryByText('Client 11')).not.toBeInTheDocument();

    // Find next page button
    const nextButton = screen.getByText('Próxima');
    fireEvent.click(nextButton);

    // Should show next page
    expect(screen.getByText('Client 11')).toBeInTheDocument();
    expect(screen.queryByText('Client 1')).not.toBeInTheDocument();
  });

  it('should call action handlers', async () => {
    render(
      <ClientList 
        clients={[mockClients[0]]} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
        onAdd={mockOnAdd} 
        isLoading={false} 
      />
    );

    const addButton = screen.getByText('Novo Cliente');
    fireEvent.click(addButton);
    expect(mockOnAdd).toHaveBeenCalled();

    const editButton = screen.getByTitle('Editar');
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockClients[0]);

    const deleteButton = screen.getByTitle('Excluir');
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(mockClients[0]);
  });
});
