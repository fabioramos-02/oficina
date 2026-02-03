interface InvoiceItem {
  id: string;
  description: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface InvoiceTableProps {
  title: string;
  items: InvoiceItem[];
}

export function InvoiceTable({ title, items }: InvoiceTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (items.length === 0) return null;

  return (
    <div className="mb-6 font-arial">
      {/* Título da Seção com fundo cinza claro */}
      <div className="bg-gray-100 py-1 px-2 mb-2">
        <h3 className="font-bold text-base text-black">{title}</h3>
      </div>

      <table className="w-full text-xs text-black">
        <thead>
          <tr className="bg-white">
            <th className="text-left py-1 font-bold w-[50%]">Descrição</th>
            <th className="text-right py-1 font-bold">Unidade</th>
            <th className="text-right py-1 font-bold">Preço unitário</th>
            <th className="text-right py-1 font-bold">Qtd.</th>
            <th className="text-right py-1 font-bold">Preço</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-none">
              <td className="py-1 font-bold align-top">{item.description}</td>
              <td className="text-right py-1 align-top">{item.unit || ''}</td>
              <td className="text-right py-1 align-top">{formatCurrency(item.unitPrice)}</td>
              <td className="text-right py-1 align-top">{item.quantity}</td>
              <td className="text-right py-1 align-top">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
