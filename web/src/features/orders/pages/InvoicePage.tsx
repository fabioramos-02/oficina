import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { workshopService } from '../../workshop/services/workshopService';
import type { Order } from '../types';
import type { Workshop } from '../../workshop/types';
import { Printer, ArrowLeft } from 'lucide-react';

// Invoice Components
import { InvoiceHeader } from '../components/invoice/InvoiceHeader';
import { InvoiceTable } from '../components/invoice/InvoiceTable';
import { InvoiceTotals } from '../components/invoice/InvoiceTotals';
import { InvoiceFooter } from '../components/invoice/InvoiceFooter';

export function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const [orderData, workshopData] = await Promise.all([
          orderService.getById(id),
          workshopService.getActive()
        ]);
        setOrder(orderData);
        setWorkshop(workshopData);
      } catch (error) {
        console.error('Failed to load invoice data', error);
        alert('Erro ao carregar dados da nota.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando nota...</div>;
  if (!order || !workshop) return <div className="p-8 text-center text-red-500">Nota não encontrada.</div>;

  const handlePrint = () => {
    document.title = `Nota de serviço n. ${String(order.numero).padStart(3, '0')}-${order.ano} ${order.cliente.nome} - ${order.veiculo?.modelo || 'Veiculo'}`;
    window.print();
  };

  // Prepare data for tables
  const serviceItems = order.servicos.map(s => ({
    id: s.id,
    description: s.servico.nome,
    unit: '', // Serviços geralmente não têm unidade visual na nota, ou pode ser 'UN' se desejar
    unitPrice: s.precoUnitario,
    quantity: s.quantidade,
    total: s.precoUnitario * s.quantidade
  }));

  const partItems = order.pecas.map(p => ({
    id: p.id,
    description: p.peca.nome,
    unit: '', // Pode ser preenchido se a peça tiver unidade no banco
    unitPrice: p.precoUnitarioUtilizado,
    quantity: p.quantidadeUtilizada,
    total: p.precoUnitarioUtilizado * p.quantidadeUtilizada
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white font-sans text-gray-900">
      {/* Toolbar - Hidden on Print */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Printer size={16} />
          Imprimir / Salvar PDF
        </button>
      </div>

      {/* Invoice Container - A4 Size - Strict Layout */}
      <div className="max-w-[210mm] mx-auto bg-white p-[15mm] print:p-0 print:w-full print:max-w-none text-black shadow-none" style={{ fontFamily: 'Arial, sans-serif' }}>
        
        <InvoiceHeader workshop={workshop} />

        {/* Invoice Title Strip */}
        <div className="bg-gray-400 py-2 px-4 mb-6 print:bg-gray-400 -mx-[15mm] pl-[15mm]">
          <h2 className="text-xl font-bold text-black uppercase">
            Nota de serviço {String(order.numero).padStart(3, '0')}-{order.ano}
          </h2>
        </div>

        {/* Client Section */}
        <div className="mb-8 pl-1">
          <p className="text-sm text-black">
            <span className="font-bold">Cliente:</span> {order.cliente.nome}
            {order.veiculo && (
              <span className="font-bold"> - {order.veiculo.modelo} {order.veiculo.placa}</span>
            )}
          </p>
        </div>

        <InvoiceTable title="Serviços" items={serviceItems} />
        <InvoiceTable title="Peças" items={partItems} />

        <InvoiceTotals 
          servicesTotal={order.valorServicos}
          partsTotal={order.valorPecas}
          discount={order.valorDesconto}
          total={order.valorTotal}
        />

        <InvoiceFooter workshop={workshop} />

      </div>
    </div>
  );
}
