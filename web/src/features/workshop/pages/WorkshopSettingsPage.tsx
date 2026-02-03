import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Building, MapPin, Globe, Loader2, User, Phone, Mail, Facebook, Instagram } from 'lucide-react';

import { MainLayout } from '../../../shared/layout/MainLayout';
import { workshopService } from '../services/workshopService';
import { cepService } from '../services/cepService';
import { LogoUpload } from '../components/LogoUpload';
import { workshopSchema, type WorkshopSchema } from '../schema';
import { useToast } from '../../../shared/components/ui/ToastContext';

const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function WorkshopSettingsPage() {
  const [loadingData, setLoadingData] = useState(true);
  const [searchingCep, setSearchingCep] = useState(false);
  const { addToast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<WorkshopSchema>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      nomeFantasia: '',
      razaoSocial: '',
      cnpj: '',
      responsavel: '',
      enderecoRua: '',
      enderecoNumero: '',
      enderecoBairro: '',
      enderecoCidade: '',
      enderecoEstado: '',
      enderecoCep: '',
      telefone: '',
      email: '',
      instagram: '',
      facebook: '',
      descricaoInstitucional: '',
      logoUrl: ''
    }
  });

  // Watch CEP for auto-search
  const cepValue = watch('enderecoCep');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await workshopService.getActive();
        reset({
          nomeFantasia: data.nomeFantasia,
          razaoSocial: data.razaoSocial,
          cnpj: data.cnpj,
          responsavel: data.responsavel || '',
          enderecoRua: data.enderecoRua,
          enderecoNumero: data.enderecoNumero,
          enderecoBairro: data.enderecoBairro,
          enderecoCidade: data.enderecoCidade,
          enderecoEstado: data.enderecoEstado,
          enderecoCep: data.enderecoCep,
          telefone: data.telefone,
          email: data.email,
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          descricaoInstitucional: data.descricaoInstitucional || '',
          logoUrl: data.logoUrl || ''
        });
      } catch (error) {
        console.error('Failed to load workshop data', error);
        addToast('Erro ao carregar dados da oficina. Verifique a conexão.', 'error');
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, [reset, addToast]);

  const handleCepBlur = async () => {
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

  const onSubmit = async (data: WorkshopSchema) => {
    try {
      await workshopService.update(data);
      addToast('Configurações da oficina salvas com sucesso.', 'success');
      reset(data);
    } catch (error) {
      console.error('Failed to update workshop', error);
      addToast('Erro ao atualizar dados. Tente novamente.', 'error');
    }
  };

  if (loadingData) {
    return (
      <MainLayout title="Configurações da Oficina">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-500">Carregando informações...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Configurações da Oficina">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto pb-24 space-y-8">
        
        {/* Section 1: Identidade da Oficina */}
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
            {/* Logo Column */}
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

            {/* Basic Info Column */}
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

        {/* Section 2: Endereço e Localização */}
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
                  onBlur={handleCepBlur}
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

        {/* Section 3: Contato e Redes */}
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

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="text-sm text-gray-500 hidden sm:block">
              {isDirty ? 'Há alterações não salvas' : 'Todas as alterações foram salvas'}
            </span>
            
            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => reset()}
                disabled={!isDirty || isSubmitting}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </form>
    </MainLayout>
  );
}
