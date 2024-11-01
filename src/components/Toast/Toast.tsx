import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../context/ToastContext';
import { useQueryClient } from '@tanstack/react-query';

export const Toast: React.FC = () => {
  const { isVisible, hideToast, transactionCount } = useToast();
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['transactions'] });
    await queryClient.refetchQueries({ queryKey: ['transactions'] });
    hideToast();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] animate-fade-in">
      <div className="flex items-center gap-x-4 bg-white px-6 py-4 shadow-lg rounded-lg border-l-4 border-green-500">
        <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            Upload Complete
          </p>
          <p className="text-sm text-gray-500">
            {transactionCount} transactions processed
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="ml-4 inline-flex items-center gap-x-2 px-3 py-2 text-sm font-semibold text-violet-600 bg-violet-50 rounded-md hover:bg-violet-100 transition-colors duration-200"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Refresh
        </button>
      </div>
    </div>
  );
}; 