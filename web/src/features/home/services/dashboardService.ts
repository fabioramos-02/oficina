import { httpClient } from '../../../core/api/httpClient';

export interface DashboardStats {
  totalOrdens: number;
  totalClientes: number;
  totalVeiculos: number;
  faturamentoTotal: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // In a real scenario, we should have a specific endpoint for dashboard stats
    // For now, we fetch lists and count (MVP approach)
    const [clientesRes, ordensRes] = await Promise.all([
      httpClient.get('/clientes'),
      httpClient.get('/ordens-servico')
    ]);

    const ordens = ordensRes.data || [];
    // Calculate basic stats
    const totalOrdens = ordens.length;
    const faturamentoTotal = ordens.reduce((acc: number, curr: any) => acc + (curr.valorTotal || 0), 0);
    
    return {
      totalClientes: clientesRes.data?.length || 0,
      totalOrdens,
      totalVeiculos: 0, // Pending implementation of vehicles endpoint usage
      faturamentoTotal
    };
  } catch (error) {
    console.error('Error fetching dashboard stats', error);
    return {
      totalOrdens: 0,
      totalClientes: 0,
      totalVeiculos: 0,
      faturamentoTotal: 0
    };
  }
};
