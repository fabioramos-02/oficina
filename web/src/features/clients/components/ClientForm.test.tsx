import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientForm } from './ClientForm';

describe('ClientForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    render(<ClientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByPlaceholderText('Nome completo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email@exemplo.com')).toBeInTheDocument();
    expect(screen.getByText('Telefone')).toBeInTheDocument();
    expect(screen.getByText('Endereço')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('should show validation error when name is empty', async () => {
    render(<ClientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Nome é obrigatório')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error for invalid email', async () => {
    render(<ClientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const emailInput = screen.getByPlaceholderText('email@exemplo.com');
    await userEvent.type(emailInput, 'invalid-email');

    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Email inválido')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    render(<ClientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await userEvent.type(screen.getByPlaceholderText('Nome completo'), 'John Doe');
    await userEvent.type(screen.getByPlaceholderText('email@exemplo.com'), 'john@example.com');
    
    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        nome: 'John Doe',
        email: 'john@example.com',
        telefone: '',
        endereco: ''
      });
    });
  });

  it('should populate form with initial data', () => {
    const initialData = {
      id: '1',
      nome: 'Existing Client',
      email: 'existing@example.com',
      telefone: '123456',
      endereco: 'Some St'
    };

    render(<ClientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} initialData={initialData} />);

    expect(screen.getByDisplayValue('Existing Client')).toBeInTheDocument();
    expect(screen.getByDisplayValue('existing@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123456')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Some St')).toBeInTheDocument();
  });
});
