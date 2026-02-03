import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkshopSettingsPage } from '../WorkshopSettingsPage';
import { workshopService } from '../../services/workshopService';
import { ToastProvider } from '../../../../shared/components/ui/ToastContext';
import { BrowserRouter } from 'react-router-dom';

// Mock services
vi.mock('../../services/workshopService', () => ({
  workshopService: {
    getActive: vi.fn(),
    update: vi.fn(),
    uploadLogo: vi.fn(),
  },
}));

// Mock layout to avoid router issues if MainLayout uses Link/NavLink
vi.mock('../../../../shared/layout/MainLayout', () => ({
  MainLayout: ({ children, title }: { children: React.ReactNode, title: string }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

const mockWorkshop = {
  nomeFantasia: 'Oficina Teste',
  razaoSocial: 'Oficina Teste LTDA',
  cnpj: '00.000.000/0001-00',
  responsavel: 'João da Silva',
  enderecoRua: 'Rua das Flores',
  enderecoNumero: '123',
  enderecoBairro: 'Centro',
  enderecoCidade: 'São Paulo',
  enderecoEstado: 'SP',
  enderecoCep: '01001-000',
  telefone: '(11) 99999-9999',
  email: 'contato@teste.com',
  logoUrl: '',
};

describe('WorkshopSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <ToastProvider>
          <WorkshopSettingsPage />
        </ToastProvider>
      </BrowserRouter>
    );
  };

  it('loads and displays workshop data', async () => {
    (workshopService.getActive as any).mockResolvedValue(mockWorkshop);
    
    renderComponent();

    expect(screen.getByText('Carregando informações...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Oficina Teste')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('Oficina Teste LTDA')).toBeInTheDocument();
    expect(screen.getByDisplayValue('João da Silva')).toBeInTheDocument();
  });

  it('updates workshop data on form submit', async () => {
    (workshopService.getActive as any).mockResolvedValue(mockWorkshop);
    (workshopService.update as any).mockResolvedValue({ ...mockWorkshop, nomeFantasia: 'Nova Oficina' });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Oficina Teste')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('Oficina Teste');
    fireEvent.change(nameInput, { target: { value: 'Nova Oficina' } });

    const saveButton = screen.getByText('Salvar Alterações');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(workshopService.update).toHaveBeenCalledWith(expect.objectContaining({
        nomeFantasia: 'Nova Oficina'
      }));
    });
  });

  it('displays validation errors', async () => {
    (workshopService.getActive as any).mockResolvedValue({
        ...mockWorkshop,
        nomeFantasia: '' // Invalid initial state to force user interaction or just empty
    });

    renderComponent();
    
    await waitFor(() => {
        expect(screen.getByPlaceholderText('Ex: Auto Center Silva')).toBeInTheDocument();
    });

    // Clear the field manually to trigger validation if it was filled
    const nameInput = screen.getByPlaceholderText('Ex: Auto Center Silva');
    fireEvent.change(nameInput, { target: { value: '' } });

    const saveButton = screen.getByText('Salvar Alterações');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Nome Fantasia é obrigatório')).toBeInTheDocument();
    });
  });
});
