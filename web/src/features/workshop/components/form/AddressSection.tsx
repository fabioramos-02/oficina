import { useState } from 'react';
import type { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { MapPin, Loader2 } from 'lucide-react';
import type { WorkshopSchema } from '../../schema';
import { cepService } from '../../services/cepService';
import { useToast } from '../../../../shared/components/ui/ToastContext';

interface AddressSectionProps {
  register: UseFormRegister<WorkshopSchema>;
  setValue: UseFormSetValue<WorkshopSchema>;
  errors: FieldErrors<WorkshopSchema>;
}

const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function AddressSection({ register, setValue, errors }: AddressSectionProps) {
  const [searchingCep, setSearchingCep] = useState(false);
  const { addToast } = useToast();

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cepValue = e.target.value;
    if (!cepValue || cepValue.length < 8) return;
    
    setSearchingCep(true);
    try {
      const data = await cepService.search(cepValue);
      if (data) {
        setValue('enderecoRua', data.logradouro);
        setValue('enderecoBairro', data.bairro);
        setValue('enderecoCidade', data.localidade);
        setValue('enderecoEstado', data.uf);
        addToast('Endereço encontrado!', 'success');
      }
    } catch (error) {
      // Silent error
    } finally {
      setSearchingCep(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
          <MapPin size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Endereço e Localização</h2>
          <p className="text-sm text-gray-500">Localização física da oficina.</p>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-6 gap-5">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-gray-700">CEP <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              {...register('enderecoCep')}
              onBlur={(e) => {
                register('enderecoCep').onBlur(e);
                handleCepBlur(e);
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.enderecoCep ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="00000-000"
            />
            {searchingCep && (
              <div className="absolute right-3 top-2.5">
                <Loader2 className="animate-spin text-blue-500" size={16} />
              </div>
            )}
          </div>
          {errors.enderecoCep && <span className="text-xs text-red-500">{errors.enderecoCep.message}</span>}
        </div>

        <div className="md:col-span-3 space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Rua / Logradouro <span className="text-red-500">*</span></label>
          <input
            {...register('enderecoRua')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.enderecoRua ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.enderecoRua && <span className="text-xs text-red-500">{errors.enderecoRua.message}</span>}
        </div>

        <div className="md:col-span-1 space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Número <span className="text-red-500">*</span></label>
          <input
            {...register('enderecoNumero')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.enderecoNumero ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.enderecoNumero && <span className="text-xs text-red-500">{errors.enderecoNumero.message}</span>}
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Bairro <span className="text-red-500">*</span></label>
          <input
            {...register('enderecoBairro')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.enderecoBairro ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.enderecoBairro && <span className="text-xs text-red-500">{errors.enderecoBairro.message}</span>}
        </div>

        <div className="md:col-span-3 space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Cidade <span className="text-red-500">*</span></label>
          <input
            {...register('enderecoCidade')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.enderecoCidade ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          />
          {errors.enderecoCidade && <span className="text-xs text-red-500">{errors.enderecoCidade.message}</span>}
        </div>

        <div className="md:col-span-1 space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Estado <span className="text-red-500">*</span></label>
          <select
            {...register('enderecoEstado')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white ${errors.enderecoEstado ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          >
            <option value="">UF</option>
            {BRAZIL_STATES.map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
          {errors.enderecoEstado && <span className="text-xs text-red-500">{errors.enderecoEstado.message}</span>}
        </div>
      </div>
    </div>
  );
}
