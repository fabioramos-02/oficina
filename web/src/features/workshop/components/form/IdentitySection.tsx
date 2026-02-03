import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { Building, User } from 'lucide-react';
import type { WorkshopSchema } from '../../schema';
import { LogoUpload } from '../LogoUpload';

interface IdentitySectionProps {
  register: UseFormRegister<WorkshopSchema>;
  control: Control<WorkshopSchema>;
  errors: FieldErrors<WorkshopSchema>;
}

export function IdentitySection({ register, control, errors }: IdentitySectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Building size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Identidade da Oficina</h2>
          <p className="text-sm text-gray-500">Informações principais que aparecerão nos documentos.</p>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo da Oficina</label>
          <Controller
            name="logoUrl"
            control={control}
            render={({ field }) => (
              <LogoUpload 
                value={field.value} 
                onChange={field.onChange} 
              />
            )}
          />
          <p className="text-xs text-gray-400 mt-3 text-center">
            Essa logo aparecerá em notas de serviço e relatórios.
          </p>
        </div>

        <div className="md:col-span-8 lg:col-span-9 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nome Fantasia <span className="text-red-500">*</span></label>
              <input
                {...register('nomeFantasia')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.nomeFantasia ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Ex: Auto Center Silva"
              />
              {errors.nomeFantasia && <span className="text-xs text-red-500">{errors.nomeFantasia.message}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">CNPJ <span className="text-red-500">*</span></label>
              <input
                {...register('cnpj')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.cnpj ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="00.000.000/0000-00"
              />
              {errors.cnpj && <span className="text-xs text-red-500">{errors.cnpj.message}</span>}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Razão Social <span className="text-red-500">*</span></label>
              <input
                {...register('razaoSocial')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.razaoSocial ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Ex: Silva Serviços Automotivos LTDA"
              />
              {errors.razaoSocial && <span className="text-xs text-red-500">{errors.razaoSocial.message}</span>}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Responsável Técnico / Proprietário</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  {...register('responsavel')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Nome do responsável"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Descrição Institucional</label>
              <textarea
                {...register('descricaoInstitucional')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                placeholder="Uma breve descrição sobre a oficina para aparecer nos orçamentos..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
