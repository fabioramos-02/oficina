import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Globe, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import type { WorkshopSchema } from '../../schema';

interface ContactSectionProps {
  register: UseFormRegister<WorkshopSchema>;
  errors: FieldErrors<WorkshopSchema>;
}

export function ContactSection({ register, errors }: ContactSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
          <Globe size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Contato e Redes Sociais</h2>
          <p className="text-sm text-gray-500">Essas informações aparecerão no rodapé das notas.</p>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Telefone / WhatsApp <span className="text-red-500">*</span></label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              {...register('telefone')}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.telefone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="(00) 00000-0000"
            />
          </div>
          {errors.telefone && <span className="text-xs text-red-500">{errors.telefone.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">E-mail de Contato <span className="text-red-500">*</span></label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              {...register('email')}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="contato@oficina.com.br"
            />
          </div>
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Instagram</label>
          <div className="relative">
            <Instagram className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              {...register('instagram')}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="@usuario"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Facebook</label>
          <div className="relative">
            <Facebook className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              {...register('facebook')}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="facebook.com/pagina"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
