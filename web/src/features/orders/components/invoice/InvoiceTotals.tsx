interface InvoiceTotalsProps {
  servicesTotal: number;
  partsTotal: number;
  discount: number;
  total: number;
}

export function InvoiceTotals({ servicesTotal, partsTotal, discount, total }: InvoiceTotalsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="flex justify-end mb-8 font-arial text-black">
      <div className="w-[300px] text-sm">
        <div className="flex justify-between py-1">
          <span>Serviços</span>
          <span>{formatCurrency(servicesTotal)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Peças</span>
          <span>{formatCurrency(partsTotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between py-1 text-red-600">
            <span>Desconto</span>
            <span>- {formatCurrency(discount)}</span>
          </div>
        )}
        <div 
          className="flex justify-between py-1 mt-1 bg-gray-200 px-2 font-bold"
          style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
        >
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
