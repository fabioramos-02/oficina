import type { Workshop } from '../../../workshop/types';

interface InvoiceFooterProps {
  workshop: Workshop;
}

export function InvoiceFooter({ workshop }: InvoiceFooterProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="mt-auto font-arial text-black">
      {/* Pagamento */}
      <div className="mb-12">
        <h3 className="font-bold text-base mb-2 border-b border-gray-300 pb-1">Pagamento</h3>
        <div className="grid grid-cols-2 gap-8 text-xs">
          <div>
            <p className="font-bold mb-1">Meios de pagamento</p>
            <p>Dinheiro, cartão de crédito, cartão de débito ou pix.</p>
          </div>
          <div>
            <p className="font-bold mb-1">PIX</p>
            <p>{workshop.cnpj.replace(/\D/g, '')}</p>
          </div>
        </div>
      </div>

      {/* Assinatura */}
      <div className="text-center">
        <p className="font-bold mb-8 text-sm">
          {workshop.enderecoCidade}, {formatDate(new Date().toISOString())}
        </p>
        
        <div className="flex flex-col items-center">
          <div className="w-[300px] border-t border-black mb-1"></div>
          <p className="font-bold text-sm leading-tight">{workshop.nomeFantasia}</p>
          <p className="text-xs">{workshop.responsavel || 'Responsável Técnico'}</p>
        </div>
      </div>
    </div>
  );
}
