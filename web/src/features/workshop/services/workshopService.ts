import { httpClient } from '../../../core/api/httpClient';
import type { Workshop, WorkshopInput } from '../types';

export const workshopService = {
  getActive: async (): Promise<Workshop> => {
    const { data } = await httpClient.get<Workshop>('/oficina');
    return data;
  },

  update: async (workshop: WorkshopInput): Promise<Workshop> => {
    const { data } = await httpClient.put<Workshop>('/oficina', workshop);
    return data;
  },

  uploadLogo: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await httpClient.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.url;
  }
};
