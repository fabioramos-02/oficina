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
    <div className="mb-6 font-arial text-black">
      {/* Section Title Bar */}
      <div className="bg-gray-100 py-1 px-2 mb-2">
        <h3 className="font-bold text-base">{title}</h3>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left py-1 font-bold w-[40%]">Descrição</th>
            <th className="text-right py-1 font-bold">Unidade</th>
            <th className="text-right py-1 font-bold">Preço unitário</th>
            <th className="text-right py-1 font-bold">Qtd.</th>
            <th className="text-right py-1 font-bold">Preço</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-transparent">
              <td className="py-2 font-bold">{item.description}</td>
              <td className="text-right py-2">{item.unit}</td>
              <td className="text-right py-2">{formatCurrency(item.unitPrice)}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
