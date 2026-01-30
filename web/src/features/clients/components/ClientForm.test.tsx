import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientForm } from './ClientForm';
import { Client } from '../types';

describe('ClientForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields correctly', () => {
    render(<ClientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByPlaceholderText('Nome completo ou Razão Social')).toBeInTheDocument();
    expect(screen.getByText('Pessoa Física')).toBeInTheDocument();
    expect(screen.getByText('Pessoa Jurídica')).toBeInTheDocument();
    // PF fields visible by default
    expect(screen.getByPlaceholderText('000.000.000-00')).toBeInTheDocument();
    // Address fields
    expect(screen.getByPlaceholderText('00000-000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Rua, Av...')).toBeInTheDocument();
  });

  it('should toggle between CPF and CNPJ when type changes', async () => {
    render(<ClientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const radioPJ = screen.getByLabelText('Pessoa Jurídica');
    fireEvent.click(radioPJ);

    expect(screen.getByPlaceholderText('00.000.000/0000-00')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('000.000.000-00')).not.toBeInTheDocument();

    const radioPF = screen.getByLabelText('Pessoa Física');
    fireEvent.click(radioPF);

    expect(screen.getByPlaceholderText('000.000.000-00')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('00.000.000/0000-00')).not.toBeInTheDocument();
  });

  it('should show validation error when required fields are empty', async () => {
    render(<ClientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Nome é obrigatório')).toBeInTheDocument();
    expect(await screen.findByText('CPF é obrigatório para Pessoa Física')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    render(<ClientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await userEvent.type(screen.getByPlaceholderText('Nome completo ou Razão Social'), 'John Doe');
    await userEvent.type(screen.getByPlaceholderText('000.000.000-00'), '123.456.789-00');
    
    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'John Doe',
        cpf: '123.456.789-00',
        tipoCliente: 'PF'
      }));
    });
  });

  it('should populate form with initial data', () => {
    const initialData: Client = {
      id: '1',
      nome: 'Existing Client',
      tipoCliente: 'PJ',
      cnpj: '00.000.000/0001-91',
      email: 'existing@example.com',
      telefone: '123456',
      logradouro: 'Some St'
    };

    render(<ClientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} initialData={initialData} />);

    expect(screen.getByDisplayValue('Existing Client')).toBeInTheDocument();
    expect(screen.getByLabelText('Pessoa Jurídica')).toBeChecked();
    expect(screen.getByDisplayValue('00.000.000/0001-91')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Some St')).toBeInTheDocument();
  });
});
