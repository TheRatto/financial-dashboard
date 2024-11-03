import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { buttonStyles } from '../styles';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  isLoading = false 
}: Props) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-dark-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-error-100 dark:bg-error-900 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-error-600 dark:text-error-400" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`${buttonStyles.danger} w-full sm:w-auto`}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className={`${buttonStyles.secondary} w-full sm:w-auto mt-3 sm:mt-0`}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
} 