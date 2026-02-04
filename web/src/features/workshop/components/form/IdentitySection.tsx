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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Building size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Identidade da Oficina</h2>
          <p className="text-sm text-gray-500">Informações principais que aparecerão nos documentos.</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Logo Column */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <div className="flex-1 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-500 transition-colors">
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
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Recomendado: JPG ou PNG até 5MB.
            </p>
          </div>

          {/* Fields Column */}
          <div className="w-full lg:w-2/3 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome Fantasia <span className="text-red-500">*</span></label>
                <input
                  {...register('nomeFantasia')}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none ${errors.nomeFantasia ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Ex: Auto Center Silva"
                />
                {errors.nomeFantasia && <span className="text-xs text-red-500">{errors.nomeFantasia.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">CNPJ <span className="text-red-500">*</span></label>
                <input
                  {...register('cnpj')}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none ${errors.cnpj ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="00.000.000/0000-00"
                />
                {errors.cnpj && <span className="text-xs text-red-500">{errors.cnpj.message}</span>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Razão Social <span className="text-red-500">*</span></label>
                <input
                  {...register('razaoSocial')}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none ${errors.razaoSocial ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Ex: Silva Serviços Automotivos LTDA"
                />
                {errors.razaoSocial && <span className="text-xs text-red-500">{errors.razaoSocial.message}</span>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Responsável Técnico / Proprietário</label>
                <div className="relative">
                  <input
                    {...register('responsavel')}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Descrição Institucional</label>
                <textarea
                  {...register('descricaoInstitucional')}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                  placeholder="Uma breve descrição sobre a oficina para aparecer nos orçamentos..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
