import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClientForm } from './ClientForm';
import { vi, describe, it, expect } from 'vitest';

describe('ClientForm', () => {
  it('should render form fields', () => {
    render(
      <ClientForm
        onSubmit={async () => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByPlaceholderText('Nome completo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email@exemplo.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('(00) 00000-0000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Endereço completo')).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const handleSubmit = vi.fn();
    render(
      <ClientForm
        onSubmit={handleSubmit}
        onCancel={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Salvar'));

    expect(await screen.findByText('Nome é obrigatório')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should validate email format', async () => {
    const handleSubmit = vi.fn();
    render(
      <ClientForm
        onSubmit={handleSubmit}
        onCancel={() => {}}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Nome completo'), { target: { value: 'Test Client' } });
    fireEvent.change(screen.getByPlaceholderText('email@exemplo.com'), { target: { value: 'invalid-email' } });
    
    fireEvent.click(screen.getByText('Salvar'));

    expect(await screen.findByText('Email inválido')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid form', async () => {
    const handleSubmit = vi.fn();
    render(
      <ClientForm
        onSubmit={handleSubmit}
        onCancel={() => {}}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Nome completo'), { target: { value: 'Test Client' } });
    fireEvent.change(screen.getByPlaceholderText('email@exemplo.com'), { target: { value: 'test@test.com' } });
    
    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        nome: 'Test Client',
        email: 'test@test.com',
        telefone: '',
        endereco: ''
      });
    });
  });

  it('should load initial data', () => {
    const initialData = {
      id: '1',
      nome: 'Existing Client',
      email: 'existing@test.com',
      telefone: '123',
      endereco: 'Address'
    };

    render(
      <ClientForm
        initialData={initialData}
        onSubmit={async () => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByDisplayValue('Existing Client')).toBeInTheDocument();
    expect(screen.getByDisplayValue('existing@test.com')).toBeInTheDocument();
  });
});
