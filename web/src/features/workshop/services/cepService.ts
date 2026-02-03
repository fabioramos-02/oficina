import axios from 'axios';

interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const cepService = {
  search: async (cep: string): Promise<CepResponse | null> => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return null;

    try {
      const response = await axios.get<CepResponse>(`https://viacep.com.br/ws/${cleanCep}/json/`);
      if (response.data.erro) return null;
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return null;
    }
  }
};
