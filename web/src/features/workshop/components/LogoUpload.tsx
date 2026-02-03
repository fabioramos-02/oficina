import React, { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { workshopService } from '../services/workshopService';
import { useToast } from '../../../shared/components/ui/ToastContext';

interface LogoUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { addToast } = useToast();

  const handleFile = async (file: File) => {
    // Validation
    if (!file.type.startsWith('image/')) {
      addToast('Apenas imagens são permitidas (JPG, PNG, SVG).', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      addToast('O arquivo deve ter no máximo 5MB.', 'error');
      return;
    }

    // Preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      // Upload
      const url = await workshopService.uploadLogo(file);
      onChange(url); // Pass the server URL to form
      addToast('Logo atualizada com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      addToast('Erro ao fazer upload da logo.', 'error');
      setPreview(value); // Revert
    } finally {
      setUploading(false);
    }
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-700">Logo da Oficina</label>
      
      <div 
        className={`
          relative flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative w-full h-full p-2 flex items-center justify-center">
            <img 
              src={preview} 
              alt="Logo Preview" 
              className="max-h-full max-w-full object-contain" 
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500 transition-colors"
              title="Remover logo"
            >
              <X size={16} />
            </button>
            {uploading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <div className="mb-3 p-3 rounded-full bg-blue-100 text-blue-600">
               {uploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
            </div>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Clique para enviar</span> ou arraste e solte
            </p>
            <p className="text-xs text-gray-400">SVG, PNG, JPG ou GIF (MAX. 5MB)</p>
          </div>
        )}

        <input 
          ref={inputRef}
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={onChangeInput}
          accept="image/*"
          disabled={uploading}
        />
      </div>
    </div>
  );
};
