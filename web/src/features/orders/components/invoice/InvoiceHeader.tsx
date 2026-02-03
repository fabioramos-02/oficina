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
    <div className="flex justify-between items-start mb-4 text-sm font-arial">
      {/* Esquerda: Logo e Dados da Empresa */}
      <div className="flex gap-6 items-start">
        {/* Logo */}
        <div className="w-[140px] h-[80px] flex items-center justify-center shrink-0">
          {workshop.logoUrl ? (
            <img src={workshop.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">LOGO</div>
          )}
        </div>
        
        {/* Dados da Empresa */}
        <div className="flex flex-col pt-1">
          <h1 className="text-xl font-bold text-black mb-1 leading-none">{workshop.nomeFantasia}</h1>
          <p className="uppercase text-black text-xs font-medium mb-0.5">{workshop.razaoSocial}</p>
          <p className="text-black text-xs mb-0.5">CNPJ: {workshop.cnpj}</p>
          <div className="text-black text-xs leading-snug mb-1">
            <p>{workshop.enderecoRua}, {workshop.enderecoNumero}</p>
            <p>{workshop.enderecoBairro}, {workshop.enderecoCidade} - {workshop.enderecoEstado}</p>
            <p>CEP {workshop.enderecoCep}</p>
          </div>
          
          {/* Especialização e Redes Sociais */}
          <div className="mt-1">
             {workshop.descricaoInstitucional && (
                <p className="text-[10px] text-black font-medium mb-1">{workshop.descricaoInstitucional}</p>
             )}
             <div className="flex gap-3 text-[10px] text-black">
                {workshop.instagram && (
                  <div className="flex items-center gap-1">
                    <Instagram size={10} className="text-black" />
                    <span>@{workshop.instagram.replace('@', '')}</span>
                  </div>
                )}
                {workshop.facebook && (
                  <div className="flex items-center gap-1">
                    <Facebook size={10} className="text-black" />
                    <span>{workshop.facebook}</span>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Direita: Contato e Data */}
      <div className="text-right flex flex-col items-end gap-1 pt-1">
        {/* Data Badge */}
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={14} className="text-black" />
          <span className="font-bold text-black text-sm bg-gray-100 px-2 py-0.5 border border-gray-300">
            {formatDate(new Date().toISOString())}
          </span>
        </div>

        {/* Contato */}
        <div className="text-xs text-black space-y-0.5">
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
