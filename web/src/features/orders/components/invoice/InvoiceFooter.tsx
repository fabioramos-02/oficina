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
      {/* Payment Section */}
      <div className="mb-10">
        <div 
          className="bg-gray-200 py-1 px-2 mb-2"
          style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
        >
          <h3 className="font-bold text-base">Pagamento</h3>
        </div>
        <div className="grid grid-cols-2 gap-8 text-xs px-2">
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

      {/* Signature Section */}
      <div className="text-center">
       <br />
       <br />

        
        <div className="flex flex-col items-center">
          <div className="w-[300px] border-t border-black mb-1"></div>
          <p className="font-bold text-sm leading-tight">{workshop.nomeFantasia}</p>
          <p className="text-xs">{workshop.responsavel || 'Responsável Técnico'}</p>
        </div>
      </div>
    </div>
  );
}
