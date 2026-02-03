import { Save, Loader2 } from 'lucide-react';

interface FormFooterProps {
  isDirty: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function FormFooter({ isDirty, isSubmitting, onCancel }: FormFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span className="text-sm text-gray-500 hidden sm:block">
          {isDirty ? 'Há alterações não salvas' : 'Todas as alterações foram salvas'}
        </span>
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onCancel}
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
  );
}
