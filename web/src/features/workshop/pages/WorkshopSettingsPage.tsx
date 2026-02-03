import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { MainLayout } from '../../../shared/layout/MainLayout';
import { workshopService } from '../services/workshopService';
import { workshopSchema, type WorkshopSchema } from '../schema';
import { useToast } from '../../../shared/components/ui/ToastContext';

import { IdentitySection } from '../components/form/IdentitySection';
import { AddressSection } from '../components/form/AddressSection';
import { ContactSection } from '../components/form/ContactSection';
import { FormFooter } from '../components/form/FormFooter';

export function WorkshopSettingsPage() {
  const [loadingData, setLoadingData] = useState(true);
  const { addToast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
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
        <IdentitySection register={register} control={control} errors={errors} />
        <AddressSection register={register} setValue={setValue} errors={errors} />
        <ContactSection register={register} errors={errors} />
        <FormFooter 
          isDirty={isDirty} 
          isSubmitting={isSubmitting} 
          onCancel={() => reset()} 
        />
      </form>
    </MainLayout>
  );
}
