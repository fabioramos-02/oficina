import type { Workshop } from '../../../workshop/types';
import { Mail, Phone, Calendar, Instagram, Facebook } from 'lucide-react';

interface InvoiceHeaderProps {
  workshop: Workshop;
}

export function InvoiceHeader({ workshop }: InvoiceHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex justify-between items-start mb-2 font-arial text-black">
      {/* Left: Logo */}
      <div className="w-[150px] h-[100px] flex items-center justify-start shrink-0 mr-4">
        {workshop.logoUrl ? (
          <img src={workshop.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
        ) : (
          <div className="w-full h-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">LOGO</div>
        )}
      </div>

      {/* Center: Company Info */}
      <div className="flex-1 pt-2">
        <h1 className="text-xl font-bold leading-tight mb-1">{workshop.nomeFantasia}</h1>
        <div className="text-xs space-y-0.5">
          <p className="uppercase font-medium">{workshop.razaoSocial}</p>
          <p>CNPJ: {workshop.cnpj}</p>
          <p>{workshop.enderecoRua}, {workshop.enderecoNumero}</p>
          <p>{workshop.enderecoBairro}, {workshop.enderecoCidade} - {workshop.enderecoEstado}</p>
          <p>CEP {workshop.enderecoCep}</p>
        </div>

        {/* Specialized & Social - Inline or below info */}
        <div className="mt-2 text-[11px]">
          {workshop.descricaoInstitucional && (
            <p className="font-medium mb-1">{workshop.descricaoInstitucional}</p>
          )}
          <div className="flex gap-4">
            {workshop.instagram && (
              <div className="flex items-center gap-1">
                <Instagram size={12} />
                <span>@{workshop.instagram.replace('@', '')}</span>
              </div>
            )}
            {workshop.facebook && (
              <div className="flex items-center gap-1">
                <Facebook size={12} />
                <span>{workshop.facebook}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Date & Contact */}
      <div className="text-right pt-2 min-w-[200px]">
        <div className="flex justify-end mb-3">
          <div 
            className="inline-flex items-center gap-2 bg-gray-50 px-2 py-1 border border-gray-200"
            style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
          >
            <Calendar size={14} />
            <span className="font-bold text-sm">{formatDate(new Date().toISOString())}</span>
          </div>
        </div>
        
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-end gap-2">
            <Mail size={12} />
            <span>{workshop.email}</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Phone size={12} />
            <span>{workshop.telefone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
