import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { workshopService } from '../../workshop/services/workshopService';
import type { Order } from '../types';
import type { Workshop } from '../../workshop/types';
import { Printer, ArrowLeft } from 'lucide-react';

// Components
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
    document.title = `Nota_${order.numero}_${order.cliente.nome}`;
    window.print();
  };

  const serviceItems = order.servicos.map(s => ({
    id: s.id,
    description: s.servico.nome,
    unit: '', 
    unitPrice: s.precoUnitario,
    quantity: s.quantidade,
    total: s.precoUnitario * s.quantidade
  }));

  const partItems = order.pecas.map(p => ({
    id: p.id,
    description: p.peca.nome,
    unit: '', 
    unitPrice: p.precoUnitarioUtilizado,
    quantity: p.quantidadeUtilizada,
    total: p.precoUnitarioUtilizado * p.quantidadeUtilizada
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white font-arial">
      {/* Toolbar */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 shadow-sm"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm"
        >
          <Printer size={16} />
          Imprimir
        </button>
      </div>

      {/* A4 Container */}
      <div className="max-w-[210mm] mx-auto bg-white p-[15mm] print:p-0 print:w-full print:max-w-none shadow-lg print:shadow-none text-black">
        
        <InvoiceHeader workshop={workshop} />

        {/* Nota Title Strip */}
        <div 
          className="bg-gray-300 py-2 px-4 mb-6 -mx-[15mm] pl-[15mm] mt-4"
          style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
        >
          <h2 className="text-xl font-bold uppercase">
            Nota de serviço {String(order.numero).padStart(3, '0')}-{order.ano}
          </h2>
        </div>

        {/* Client */}
        <div className="mb-6">
          <p className="text-sm">
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
