import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { workshopService } from '../../workshop/services/workshopService';
import type { Order } from '../types';
import type { Workshop } from '../../workshop/types';
import { Printer, ArrowLeft, Mail, Phone, Calendar } from 'lucide-react';

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

  if (loading) return <div className="p-8">Carregando nota...</div>;
  if (!order || !workshop) return <div className="p-8">Nota não encontrada.</div>;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handlePrint = () => {
    document.title = `Nota de serviço n. ${String(order.numero).padStart(3, '0')}-${order.ano} ${order.cliente.nome} - ${order.veiculo?.modelo || 'Veiculo'}`;
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
      {/* Toolbar - Hidden on Print */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Printer size={16} />
          Imprimir / Salvar PDF
        </button>
      </div>

      {/* Invoice Container - A4 Size */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg p-8 print:shadow-none print:p-0 print:w-full" style={{ fontFamily: 'Arial, sans-serif' }}>
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            {/* Logo */}
            <div className="w-32 h-24 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
              {workshop.logoUrl ? (
                <img src={workshop.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <span>LOGO</span>
              )}
            </div>
            
            {/* Workshop Info */}
            <div className="text-sm">
              <h1 className="text-xl font-bold text-gray-900 mb-1">{workshop.nomeFantasia}</h1>
              <p className="uppercase font-bold text-gray-700">{workshop.razaoSocial}</p>
              <p className="text-gray-600">CNPJ: {workshop.cnpj}</p>
              <p className="text-gray-600 mt-1">
                {workshop.enderecoRua}, {workshop.enderecoNumero}<br/>
                {workshop.enderecoBairro}, {workshop.enderecoCidade}-{workshop.enderecoEstado}<br/>
                CEP {workshop.enderecoCep}
              </p>
            </div>
          </div>

          {/* Contact & Date */}
          <div className="text-right text-sm">
            <div className="flex flex-col items-end gap-1 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={14} />
                <span>{workshop.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone size={14} />
                <span>{workshop.telefone}</span>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded border border-gray-200">
              <Calendar size={14} />
              <span className="font-bold">{formatDate(new Date().toISOString())}</span>
            </div>
          </div>
        </div>

        {/* Description & Socials */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">{workshop.descricaoInstitucional}</p>
          <div className="flex gap-4 bg-gray-50 p-2 rounded text-sm">
            {workshop.instagram && (
              <div className="flex items-center gap-1">
                <span className="font-bold">Instagram:</span> {workshop.instagram}
              </div>
            )}
            {workshop.facebook && (
              <div className="flex items-center gap-1">
                <span className="font-bold">Facebook:</span> {workshop.facebook}
              </div>
            )}
          </div>
        </div>

        {/* Invoice Title */}
        <div className="bg-gray-200 p-2 mb-6 border-l-4 border-gray-600">
          <h2 className="text-xl font-bold text-gray-800">
            Nota de serviço {String(order.numero).padStart(3, '0')}-{order.ano}
          </h2>
        </div>

        {/* Client Info */}
        <div className="mb-8">
          <p className="text-base">
            <span className="font-bold">Cliente:</span> {order.cliente.nome}
            {order.veiculo && (
              <span className="ml-8"><span className="font-bold">Veículo:</span> {order.veiculo.modelo} ({order.veiculo.placa})</span>
            )}
          </p>
        </div>

        {/* Services Section */}
        {order.servicos.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-2 border-b pb-1">Serviços</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="text-left py-2">Descrição</th>
                  <th className="text-right py-2">Unidade</th>
                  <th className="text-right py-2">Preço unitário</th>
                  <th className="text-right py-2">Qtd.</th>
                  <th className="text-right py-2">Preço</th>
                </tr>
              </thead>
              <tbody>
                {order.servicos.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 font-medium">{item.servico.nome}</td>
                    <td className="text-right py-2">UN</td>
                    <td className="text-right py-2">{formatCurrency(item.precoUnitario)}</td>
                    <td className="text-right py-2">{item.quantidade}</td>
                    <td className="text-right py-2">{formatCurrency(item.precoUnitario * item.quantidade)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Parts Section */}
        {order.pecas.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-2 border-b pb-1">Peças</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="text-left py-2">Descrição</th>
                  <th className="text-right py-2">Unidade</th>
                  <th className="text-right py-2">Preço unitário</th>
                  <th className="text-right py-2">Qtd.</th>
                  <th className="text-right py-2">Preço</th>
                </tr>
              </thead>
              <tbody>
                {order.pecas.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 font-medium">{item.peca.nome}</td>
                    <td className="text-right py-2">UN</td>
                    <td className="text-right py-2">{formatCurrency(item.precoUnitarioUtilizado)}</td>
                    <td className="text-right py-2">{item.quantidadeUtilizada}</td>
                    <td className="text-right py-2">{formatCurrency(item.precoUnitarioUtilizado * item.quantidadeUtilizada)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64 bg-gray-50 rounded p-4">
            <div className="flex justify-between mb-1 text-sm">
              <span>Serviços</span>
              <span>{formatCurrency(order.valorServicos)}</span>
            </div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Peças</span>
              <span>{formatCurrency(order.valorPecas)}</span>
            </div>
            
            {(order.desconto > 0) && (
              <div className="flex justify-between mb-1 text-sm text-red-600">
                <span>Desconto</span>
                <span>- {formatCurrency(order.valorDesconto)}</span>
              </div>
            )}
            
            <div className="flex justify-between mt-2 pt-2 border-t border-gray-300 font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(order.valorTotal)}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-gray-50 p-4 rounded mb-12">
          <h3 className="font-bold text-base mb-2">Pagamento</h3>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-bold mb-1">Meios de pagamento</p>
              <p className="text-gray-700">Dinheiro, cartão de crédito, cartão de débito ou pix.</p>
            </div>
            <div>
              <p className="font-bold mb-1">PIX</p>
              <p className="text-gray-700">{workshop.cnpj.replace(/\D/g, '')}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-auto">
          <p className="font-bold mb-8">
            {workshop.enderecoCidade}, {formatDate(new Date().toISOString())}
          </p>
          
          <div className="inline-block px-12 pt-2 border-t border-gray-400">
            <p className="font-bold text-lg">{workshop.nomeFantasia}</p>
            <p className="text-gray-600 text-sm">{workshop.responsavel || 'Responsável Técnico'}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
